"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttGridMapElement.module.css";
import { memo, useEffect, useMemo, useRef } from "react";
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
import {
	useVttResourceDrag,
	VttResourceDragSnap,
} from "../../../Hooks/useVttResourceDrag";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";

const VttGridMapElementContainer = newStyledElement.div(
	styles.vttGridMapElementContainer,
);
const VttGridMapCoordinateIndicator = newStyledElement.div(
	styles.vttGridMapCoordinateIndicator,
);

interface TransformedGridMapGeometry {
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
}
function getTransformedGridMapGeometry(
	width: number,
	height: number,
	offsetX: number,
	offsetY: number,
	rotation: number,
	horizontalMirror: boolean,
	verticalMirror: boolean,
): TransformedGridMapGeometry {
	const radians = (rotation * Math.PI) / 180;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const scaleX = horizontalMirror ? -1 : 1;
	const scaleY = verticalMirror ? -1 : 1;

	function transformPoint(x: number, y: number) {
		const mirroredX = x * scaleX;
		const mirroredY = y * scaleY;

		return {
			x: mirroredX * cos - mirroredY * sin,
			y: mirroredX * sin + mirroredY * cos,
		};
	}

	const halfWidth = width / 2;
	const halfHeight = height / 2;

	const corners = [
		transformPoint(-halfWidth, -halfHeight),
		transformPoint(halfWidth, -halfHeight),
		transformPoint(halfWidth, halfHeight),
		transformPoint(-halfWidth, halfHeight),
	];

	const minX = Math.min(...corners.map((point) => point.x));
	const maxX = Math.max(...corners.map((point) => point.x));
	const minY = Math.min(...corners.map((point) => point.y));
	const maxY = Math.max(...corners.map((point) => point.y));

	const transformedOffset = transformPoint(
		offsetX - halfWidth,
		offsetY - halfHeight,
	);

	function clean(value: number) {
		const rounded = Math.round(value);
		return Math.abs(value - rounded) < 1e-8 ? rounded : value;
	}

	return {
		width: clean(maxX - minX),
		height: clean(maxY - minY),
		offsetX: clean(transformedOffset.x - minX),
		offsetY: clean(transformedOffset.y - minY),
	};
}
function getGridMapSnap(
	gridMap: VttGridMap["gridMap"],
	rotation: number,
	horizontalMirror: boolean,
	verticalMirror: boolean,
): VttResourceDragSnap {
	const geometry = getTransformedGridMapGeometry(
		gridMap.width,
		gridMap.height,
		gridMap.offsetX,
		gridMap.offsetY,
		rotation,
		horizontalMirror,
		verticalMirror,
	);

	return {
		type: "centered",
		cellSize: DEFAULT_GRID_CELL_SIZE,
		width: geometry.width,
		height: geometry.height,
		offsetX: geometry.offsetX,
		offsetY: geometry.offsetY,
	};
}

interface VttGridMapElementProps {
	vttGridMap: VttGridMap;
}
export const VttGridMapElement = memo(function VttGridMapElement({
	vttGridMap,
}: VttGridMapElementProps) {
	const { worldToScreen, camera } = useVttThrottledViewportContext(32);
	const { activeLayer } = useVttBoardLayerContext();
	const { send, subscribe } = useVttContext();
	const radialMenu = useRadialMenu();

	const vttGridMapRef = useRef(vttGridMap);
	vttGridMapRef.current = vttGridMap;

	const isActiveInLayer = activeLayer == VttBoardLayer.GridMap;
	const gridMap = vttGridMap.gridMap;
	const transform = vttGridMap.transform;
	const dragResourceLock = vttGridMap.resourceLocks.find(
		(lock) => lock.lockType == "drag",
	);

	const drag = useVttResourceDrag({
		coordinates: vttGridMap.coordinates,
		resourceLock: dragResourceLock,
		enabled: isActiveInLayer,
		snap: useMemo(
			() =>
				getGridMapSnap(
					gridMap,
					transform.rotation,
					transform.horizontalMirror,
					transform.verticalMirror,
				),
			[
				gridMap.width,
				gridMap.height,
				gridMap.offsetX,
				gridMap.offsetY,
				transform.rotation,
				transform.horizontalMirror,
				transform.verticalMirror,
			],
		),
		onDragStart: () => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Post",
				data: {
					vttGridMapId: vttGridMapRef.current.id,
				},
			});
		},
		onDragUpdate: (coordinates) => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Patch",
				data: {
					vttGridMapId: vttGridMapRef.current.id,
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
					vttGridMapId: vttGridMapRef.current.id,
					coordinates,
				},
			});
		},
		onLongPress: () => {
			openRadialMenu(vttGridMapRef, send, radialMenu, drag.snapCoordinates);
		},
	});

	useEffect(() => {
		return subscribe("VttGridMapDragCanceled", (event) => {
			const payload = event.data as {
				vttGridMapId: Guid;
			};
			if (payload.vttGridMapId != vttGridMapRef.current.id) return;
			drag.cancel();
		});
	}, [subscribe, drag.cancel]);

	const position = worldToScreen(drag.coordinates);
	const pixelScale = PIXELS_PER_CENTIMETER * camera.zoom;
	const width = gridMap.width * pixelScale;
	const height = gridMap.height * pixelScale;
	const left = position.x - width / 2;
	const top = position.y - height / 2;

	return (
		<>
			<VttGridMapElementContainer
				{...setVttElementDataAttributes(
					VttElementDataAttribute.EventPing,
					VttElementDataAttribute.EventZoom,
					VttElementDataAttribute.EventMiddleButtonPan,
				)}
				className={isActiveInLayer ? styles.activeLayer : undefined}
				style={{
					left,
					top,
					width,
					height,
					transformOrigin: "center center",
					rotate: `${transform.rotation}deg`,
					scale: `${transform.horizontalMirror ? -1 : 1} ${transform.verticalMirror ? -1 : 1}`,
					touchAction: "none",
					...(dragResourceLock
						? drag.isLocalDragging
							? { outlineColor: "blue", zIndex: 10000 }
							: { outlineColor: "yellow", zIndex: 9999 }
						: undefined),
				}}
				onPointerDown={drag.onPointerDown}
				onPointerMove={drag.onPointerMove}
				onPointerUp={drag.onPointerUp}
				onContextMenu={(event) => {
					event.preventDefault();
					drag.clearLongPress();
					openRadialMenu(vttGridMapRef, send, radialMenu, drag.snapCoordinates);
				}}>
				<BasicMedia
					src={gridMap.imageUrl}
					alt={gridMap.name}
					className={styles.media}
					fill
					style={{
						pointerEvents: "none",
						opacity: transform.opacity / 100,
					}}
				/>
			</VttGridMapElementContainer>
			{isActiveInLayer && (
				<VttGridMapCoordinateIndicator
					style={{
						left: position.x,
						top: position.y,
						...(dragResourceLock
							? drag.isLocalDragging
								? { outlineColor: "blue", zIndex: 10000 }
								: { outlineColor: "yellow", zIndex: 9999 }
							: undefined),
					}}
				/>
			)}
		</>
	);
});

function openRadialMenu(
	vttGridMapRef: React.RefObject<VttGridMap>,
	send: (message: VttInputMessage) => void,
	radialMenu: RadialMenuContext,
	snapCoordinates: (
		coordinates: CoordinatePair,
		snap?: VttResourceDragSnap,
	) => CoordinatePair,
) {
	const vttGridMap = vttGridMapRef.current;
	if (!vttGridMap) return;

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
			const currentGridMap = vttGridMapRef.current;
			if (!currentGridMap) return;

			const newVttGridMap = {
				...currentGridMap,
				transform: { ...currentGridMap.transform },
				coordinates: { ...currentGridMap.coordinates },
			};
			let shouldSnapAfterTransform = false;

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
					shouldSnapAfterTransform = true;
					break;
				case "Rotate-":
					newVttGridMap.transform.rotation = wrap(
						newVttGridMap.transform.rotation - 90,
						0,
						360,
					);
					shouldSnapAfterTransform = true;
					break;
				case "MirrorX":
					newVttGridMap.transform.horizontalMirror =
						!newVttGridMap.transform.horizontalMirror;
					shouldSnapAfterTransform = true;
					break;
				case "MirrorY":
					newVttGridMap.transform.verticalMirror =
						!newVttGridMap.transform.verticalMirror;
					shouldSnapAfterTransform = true;
					break;
				case "Reset":
					newVttGridMap.transform = {
						opacity: 100,
						rotation: 0,
						horizontalMirror: false,
						verticalMirror: false,
					};
					shouldSnapAfterTransform = true;
					break;
				case "Duplicate": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/scenes/gridmaps/duplicate",
						method: "Post",
						data: { vttGridMapId: currentGridMap.id },
					});
					return;
				}
				case "Delete": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/scenes/gridmaps",
						method: "Delete",
						data: { vttGridMapId: currentGridMap.id },
					});
					return;
				}
			}

			if (shouldSnapAfterTransform) {
				const snap = getGridMapSnap(
					newVttGridMap.gridMap,
					newVttGridMap.transform.rotation,
					newVttGridMap.transform.horizontalMirror,
					newVttGridMap.transform.verticalMirror,
				);
				newVttGridMap.coordinates = snapCoordinates(
					newVttGridMap.coordinates,
					snap,
				);
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
