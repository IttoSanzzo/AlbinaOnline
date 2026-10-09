"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttGridMapElement.module.css";
import { memo, useEffect } from "react";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { PIXELS_PER_CENTIMETER } from "../../../Contexts/VttViewportContextProvider";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import {
	RadialMenuContext,
	useRadialMenu,
} from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { WindowCursorState } from "../../../Contexts/WindowStates";
import { RadialMenuOption } from "@/components/(SPECIAL)/components/RadialMenu/types";
import { StandartTextColor } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";
import { clamp, wrap } from "@/utils/Math";
import { Guid } from "@/libs/stp@types";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { VttInputMessage } from "../../../Types/Core/VttInputMessage";
import { DEFAULT_GRID_CELL_SIZE } from "../../../Contexts/VttGridProvider";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";
import { useVttResourceDrag } from "../../../Hooks/useVttResourceDrag";

const VttGridMapElementContainer = newStyledElement.div(
	styles.vttGridMapElementContainer,
);

interface VttGridMapElementProps {
	vttGridMap: VttGridMap;
}
export const VttGridMapElement = memo(function VttGridMapElement({
	vttGridMap,
}: VttGridMapElementProps) {
	const { worldToScreen, camera } = useVttThrottledViewportContext(16);
	const { activeLayer } = useVttBoardLayerContext();
	const { send, subscribe } = useVttContext();
	const radialMenu = useRadialMenu();

	const dragResourceLock = vttGridMap.resourceLocks.find(
		(lock) => lock.lockType == "drag",
	);
	const isActiveInLayer = activeLayer == VttBoardLayer.GridMap;

	const drag = useVttResourceDrag({
		coordinates: vttGridMap.coordinates,
		resourceLock: dragResourceLock,
		enabled: isActiveInLayer,
		snap: DEFAULT_GRID_CELL_SIZE,
		onDragStart: () => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Post",
				data: {
					vttGridMapId: vttGridMap.id,
				},
			});
		},
		onDragUpdate: (coordinates) => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Patch",
				data: {
					vttGridMapId: vttGridMap.id,
					coordinates,
				},
			});
		},
		onDragEnd: (coordinates) => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Put",
				data: {
					vttGridMapId: vttGridMap.id,
					coordinates,
				},
			});
		},
		onLongPress: () => {
			openRadialMenu(vttGridMap, send, radialMenu);
		},
	});

	useEffect(() => {
		return subscribe("VttGridMapDragCanceled", (event) => {
			const payload = event.data as {
				vttGridMapId: Guid;
			};
			if (payload.vttGridMapId != vttGridMap.id) return;
			drag.cancel();
		});
	}, [subscribe, vttGridMap.id, drag.cancel]);

	const coordinates = worldToScreen(drag.coordinates);
	const x =
		coordinates.x -
		vttGridMap.gridMap.offsetX * PIXELS_PER_CENTIMETER * camera.zoom;
	const y =
		coordinates.y -
		vttGridMap.gridMap.offsetY * PIXELS_PER_CENTIMETER * camera.zoom;
	const width = vttGridMap.gridMap.width * PIXELS_PER_CENTIMETER * camera.zoom;
	const height =
		vttGridMap.gridMap.height * PIXELS_PER_CENTIMETER * camera.zoom;

	return (
		<VttGridMapElementContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}
			className={isActiveInLayer ? styles.activeLayer : undefined}
			style={{
				rotate: `${vttGridMap.transform.rotation}deg`,
				scale: `${vttGridMap.transform.horizontalMirror ? -1 : 1} ${vttGridMap.transform.verticalMirror ? -1 : 1}`,
				touchAction: "none",
				...(dragResourceLock
					? drag.isLocalDragging
						? { outlineColor: "blue", zIndex: 10000 }
						: { outlineColor: "yellow", zIndex: 9999 }
					: undefined),
			}}
			data-vtt-board-x={x}
			data-vtt-board-y={y}
			data-vtt-board-height={height}
			data-vtt-board-width={width}
			onPointerDown={drag.onPointerDown}
			onPointerMove={drag.onPointerMove}
			onPointerUp={drag.onPointerUp}
			onContextMenu={(event) => {
				event.preventDefault();
				drag.clearLongPress();
				openRadialMenu(vttGridMap, send, radialMenu);
			}}>
			<BasicMedia
				src={vttGridMap.gridMap.imageUrl}
				alt={vttGridMap.gridMap.name}
				className={styles.media}
				fill
				style={{
					pointerEvents: "none",
					opacity: vttGridMap.transform.opacity / 100,
				}}
			/>
		</VttGridMapElementContainer>
	);
});

function openRadialMenu(
	vttGridMap: VttGridMap,
	send: (message: VttInputMessage) => void,
	radialMenu: RadialMenuContext,
) {
	radialMenu.openNew({
		id: vttGridMap.id,
		name: "GridMap",
		screenPosition: { x: WindowCursorState.x, y: WindowCursorState.y },
		actionPosition: { x: 0, y: 0 },
		seekMouseOutside: false,
		options: radialMenuOptions,
		nameColor: StandartTextColor["gray"],
		ringWidths: [120],
		onSubmit: (data) => {
			const newVttGridMap = vttGridMap;
			switch (data.option.id) {
				case "Cancel":
					data.close();
					return;
				case "BringUp":
					break;
				case "Opacity+":
					newVttGridMap.transform.opacity = clamp(
						newVttGridMap.transform.opacity + 10,
						0,
						100,
					);
					break;
				case "Opacity-":
					newVttGridMap.transform.opacity = clamp(
						newVttGridMap.transform.opacity - 10,
						0,
						100,
					);
					break;
				case "Rotate+":
					newVttGridMap.transform.rotation = wrap(
						newVttGridMap.transform.rotation + 90,
						0,
						360,
					);
					break;
				case "Rotate-":
					newVttGridMap.transform.rotation = wrap(
						newVttGridMap.transform.rotation - 90,
						0,
						360,
					);
					break;
				case "MirrorX":
					newVttGridMap.transform.horizontalMirror =
						!newVttGridMap.transform.horizontalMirror;
					break;
				case "MirrorY":
					newVttGridMap.transform.verticalMirror =
						!newVttGridMap.transform.verticalMirror;
					break;
				case "Reset":
					newVttGridMap.transform = {
						opacity: 100,
						rotation: 0,
						horizontalMirror: false,
						verticalMirror: false,
					};
					break;
				case "Duplicate": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/scenes/gridmaps/duplicate",
						method: "Post",
						data: { vttGridMapId: vttGridMap.id },
					});
					return;
				}
				case "Delete": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/scenes/gridmaps",
						method: "Delete",
						data: { vttGridMapId: vttGridMap.id },
					});
					return;
				}
			}
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps",
				method: "Put",
				data: { vttGridMap: newVttGridMap },
			});
			if (data.option.id == "BringUp") data.close();
		},
	});
}
const radialMenuOptions: RadialMenuOption[] = [
	{
		id: "Cancel",
		name: "Cancelar",
		nameColor: StandartTextColor["lightGray"],
		backgroundColor: StandartTextColor["darkerGray"],
		icon: (
			<StpIcon
				name={"XCircle"}
				color={"gray"}
			/>
		),
		description: "Fecha esse menu radial",
	},
	{
		id: "BringUp",
		name: "PinUp",
		icon: (
			<StpIcon
				name={"CaretCircleUp"}
				color={"gray"}
			/>
		),
		description: "Trás esse VttGridMap para o topo",
	},
	{
		id: "Opacity+",
		name: "Opacidade +",
		icon: (
			<StpIcon
				name={"Sunglasses"}
				color={"lightCyan"}
			/>
		),
		description: "Aumenta a opacidade do VttGridMap (max 100%)",
	},
	{
		id: "Opacity-",
		name: "Opacidade -",
		icon: (
			<StpIcon
				name={"Eyeglasses"}
				color={"lightCyan"}
			/>
		),
		description: "Diminui a opacidade do VttGridMap (min 0%)",
	},
	{
		id: "Rotate+",
		name: "Rotacionar +",
		icon: (
			<StpIcon
				name={"ArrowClockwise"}
				color={"lightCyan"}
			/>
		),
		description: "Rotaciona o VttGridMap em sentido horário",
	},
	{
		id: "Rotate-",
		name: "Rotacionar -",
		icon: (
			<StpIcon
				name={"ArrowCounterClockwise"}
				color={"lightCyan"}
			/>
		),
		description: "Rotaciona o VttGridMap em sentido anti-horário",
	},
	{
		id: "MirrorX",
		name: "Espelhar X",
		icon: (
			<StpIcon
				name={"FlipHorizontal"}
				color={"lightCyan"}
			/>
		),
		description: "Espelha esse VttGridMap horizontalmente",
	},
	{
		id: "MirrorY",
		name: "Espelhar Y",
		icon: (
			<StpIcon
				name={"FlipVertical"}
				color={"lightCyan"}
			/>
		),
		description: "Espelha esse VttGridMap verticalmente",
	},
	{
		id: "Duplicate",
		name: "Duplicar",
		icon: (
			<StpIcon
				name={"Copy"}
				color={"gray"}
				style={"fill"}
			/>
		),
		description: "Duplica esse VttGridMap",
	},
	{
		id: "Reset",
		name: "Resetar",
		icon: (
			<StpIcon
				name={"Recycle"}
				color={"gray"}
			/>
		),
		description: "Remove todas as transformações desse VttGridMap",
	},
	{
		id: "Delete",
		name: "Remover",
		icon: (
			<StpIcon
				name={"Trash"}
				color={"black"}
			/>
		),
		nameColor: StandartTextColor["black"],
		backgroundColor: StandartTextColor["darkRed"],
		description: "Remove esse VttGridMap da cena",
	},
];
