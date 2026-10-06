import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { VirtualGridView } from "./VirtualGridView";
import { GridMapBoardLayer } from "./GridMapBoardLayer";
import { memo } from "react";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../Utils/ElementDataAttributeUtils";

const VttBoardContainer = newStyledElement.div(styles.vttBoardContainer);

export const VttBoard = memo(function VttBoard() {
	// const { activeSceneId } = useVttContext();
	return (
		<VttBoardContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}>
			<GridMapBoardLayer />
			<VirtualGridView />
		</VttBoardContainer>
	);
});
