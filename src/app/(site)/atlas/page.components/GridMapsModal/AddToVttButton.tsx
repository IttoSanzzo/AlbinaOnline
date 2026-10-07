import { setVttElementHoverInteraction } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Utils/ElementDataAttributeUtils";
import styles from "./AddToVttButton.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { VttCursorInteractionType } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Types/Classes/VttMouseState";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { Dispatch, SetStateAction } from "react";
import { useVttContext } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Contexts/VttContextProvider";
import { Guid } from "@/libs/stp@types";
import { PIXELS_PER_CENTIMETER } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Contexts/VttViewportContextProvider";
import { DEFAULT_GRID_CELL_SIZE } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Contexts/VttGridProvider";
import { useVttThrottledViewportContext } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Contexts/VttThrottledViewportContext";

const AddToVttButtonCore = newStyledElement.button(styles.addToVttButtonCore);

interface AddToVttButtonProps {
	gridMap: GridMap;
	setCoreModalOpenState?: Dispatch<SetStateAction<boolean>>;
}
export function AddToVttButton({
	gridMap,
	setCoreModalOpenState,
}: AddToVttButtonProps) {
	const { send, activeSceneId } = useVttContext();
	const { screenToWorld, viewport, camera } =
		useVttThrottledViewportContext(200);
	return (
		<AddToVttButtonCore
			{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
			onClick={(event) => {
				event.preventDefault();
				if (setCoreModalOpenState) setCoreModalOpenState(false);

				const imageWidth = gridMap.width * PIXELS_PER_CENTIMETER * camera.zoom;
				const imageHeight =
					gridMap.height * PIXELS_PER_CENTIMETER * camera.zoom;

				const imageOrigin = screenToWorld({
					x: viewport.width / 2 - imageWidth / 2,
					y: viewport.height / 2 - imageHeight / 2,
				});

				const snappedOrigin = {
					x:
						Math.round(imageOrigin.x / DEFAULT_GRID_CELL_SIZE) *
						DEFAULT_GRID_CELL_SIZE,
					y:
						Math.round(imageOrigin.y / DEFAULT_GRID_CELL_SIZE) *
						DEFAULT_GRID_CELL_SIZE,
				};

				const coordinates = {
					x: snappedOrigin.x + gridMap.offsetX,
					y: snappedOrigin.y + gridMap.offsetY,
				};

				send({
					id: Guid.NewGuid(),
					path: "/scene/gridmaps",
					method: "Post",
					data: {
						sceneId: activeSceneId,
						gridMapId: gridMap.id,
						coordinates: {
							x: coordinates.x,
							y: coordinates.y,
						},
					},
				});
			}}>
			Add to Vtt
		</AddToVttButtonCore>
	);
}
