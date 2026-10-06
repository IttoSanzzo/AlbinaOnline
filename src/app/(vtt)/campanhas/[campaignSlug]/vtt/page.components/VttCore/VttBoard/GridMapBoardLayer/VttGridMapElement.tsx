import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttGridMapElement.module.css";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";
import { memo } from "react";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { PIXELS_PER_CENTIMETER } from "../../../Contexts/VttViewportContextProvider";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import { useRadialMenu } from "@/components/(SPECIAL)/components/RadialMenu/Context";
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

const VttGridMapElementContainer = newStyledElement.div(
	styles.vttGridMapElementContainer,
);

interface VttGridMapElementProps {
	vttGridMap: VttGridMap;
}
export const VttGridMapElement = memo(function VttGridMapElement({
	vttGridMap,
}: VttGridMapElementProps) {
	const { worldToScreen, camera } = useVttThrottledViewportContext(10);
	const { activeLayer } = useVttBoardLayerContext();
	const { send } = useVttContext();
	const radialMenu = useRadialMenu();

	const isActiveInLayer = activeLayer == VttBoardLayer.GridMap;

	const coordinates = worldToScreen(vttGridMap.coordinates);
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
			}}
			data-vtt-board-x={x}
			data-vtt-board-y={y}
			data-vtt-board-height={height}
			data-vtt-board-width={width}
			onContextMenu={(event) => {
				event.preventDefault();

				radialMenu.openNew({
					id: vttGridMap.id,
					name: "GridMap",
					screenPosition: { x: WindowCursorState.x, y: WindowCursorState.y },
					actionPosition: { x: 0, y: 0 },
					options: radialMenuOptions,
					nameColor: StandartTextColor["lightGray"],
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
							case "Delete": {
								data.close();
								send({
									id: Guid.NewGuid(),
									path: "/scene/gridmaps",
									method: "Delete",
									data: { vttGridMapId: vttGridMap.id },
								});
								return;
							}
						}
						send({
							id: Guid.NewGuid(),
							path: "/scene/gridmaps",
							method: "Put",
							data: { vttGridMap: newVttGridMap },
						});
						if (data.option.id == "BringUp") data.close();
					},
				});
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

const radialMenuOptions: RadialMenuOption[] = [
	{
		id: "Cancel",
		name: "Cancelar",
		icon: undefined,
		nameColor: StandartTextColor["lightGray"],
		backgroundColor: StandartTextColor["darkerGray"],
	},
	{
		id: "BringUp",
		name: "PinUp",
		icon: undefined,
	},
	{
		id: "Opacity+",
		name: "Opacidade +",
		icon: undefined,
	},
	{
		id: "Opacity-",
		name: "Opacidade -",
		icon: undefined,
	},
	{
		id: "Rotate+",
		name: "Rotacionar +",
		icon: undefined,
	},
	{
		id: "Rotate-",
		name: "Rotacionar -",
		icon: undefined,
	},
	{
		id: "MirrorX",
		name: "Espelhar X",
		icon: undefined,
	},
	{
		id: "MirrorY",
		name: "Espelhar Y",
		icon: undefined,
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
	},
];
