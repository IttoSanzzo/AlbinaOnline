import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./LayerContextualButtonsTopRight.module.css";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../../Contexts/VttBoardLayerContext";
import { GridMapsModal } from "@/app/(site)/atlas/page.components/GridMapsModal";

const LayerContextualButtonsTopRightContainer = newStyledElement.div(
	styles.layerContextualButtonsTopRightContainer,
);

export function LayerContextualButtonsTopRight() {
	const activeLayer = useVttBoardLayerContext((state) => state.activeLayer);

	return (
		<LayerContextualButtonsTopRightContainer>
			{activeLayer == VttBoardLayer.GridMap && (
				<>
					<GridMapsModal isInVtt />
				</>
			)}
		</LayerContextualButtonsTopRightContainer>
	);
}
