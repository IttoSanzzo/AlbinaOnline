import { setVttElementHoverInteraction } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Utils/ElementDataAttributeUtils";
import styles from "./AddToVttButton.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { VttCursorInteractionType } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Types/Classes/VttMouseState";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { Dispatch, SetStateAction } from "react";
import { useVttContext } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Contexts/VttContextProvider";
import { Guid } from "@/libs/stp@types";
import { useVttThrottledViewportContext } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Contexts/VttThrottledViewportContext";
import { getGridMapSnap } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/VttCore/VttBoard/GridMapBoardLayer/VttGridMapElement.utils";
import { applySnap } from "@/app/(vtt)/campanhas/[campaignSlug]/vtt/page.components/Hooks/useVttResourceDrag";

const AddToVttButtonCore = newStyledElement.button(styles.addToVttButtonCore);

const throttleMs = 200;

interface AddToVttButtonProps {
	gridMap: GridMap;
	setCoreModalOpenState?: Dispatch<SetStateAction<boolean>>;
}
export function AddToVttButton({
	gridMap,
	setCoreModalOpenState,
}: AddToVttButtonProps) {
	const send = useVttContext((state) => state.send);
	const activeSceneId = useVttContext((state) => state.activeSceneId);
	const screenToWorld = useVttThrottledViewportContext(
		(state) => state.screenToWorld,
		throttleMs,
	);
	const viewport = useVttThrottledViewportContext(
		(state) => state.viewport,
		throttleMs,
	);

	return (
		<AddToVttButtonCore
			{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
			onClick={(event) => {
				event.preventDefault();
				if (setCoreModalOpenState) setCoreModalOpenState(false);

				const imageOrigin = screenToWorld({
					x: viewport.width / 2,
					y: viewport.height / 2,
				});
				const resourceDragSnap = getGridMapSnap(gridMap, 0, false, false);
				const snapCoordinates = applySnap(imageOrigin, resourceDragSnap);

				send({
					id: Guid.NewGuid(),
					path: "/scenes/gridmaps",
					method: "Post",
					data: {
						sceneId: activeSceneId,
						gridMapId: gridMap.id,
						coordinates: {
							x: snapCoordinates.x,
							y: snapCoordinates.y,
						},
					},
				});
			}}>
			Add to Vtt
		</AddToVttButtonCore>
	);
}
