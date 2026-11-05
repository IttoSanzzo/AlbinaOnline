import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { memo } from "react";
import { useVttGridMapStore } from "../../../Stores/VttGridMapStore";
import { VttGridMapElementWrapper } from "./VttGridMapElementWrapper";

const GridMapBoardLayerContainer = newStyledElement.div(
	styles.gridMapBoardLayerContainer,
);

export const GridMapBoardLayer = memo(function GridMapBoardLayer() {
	const vttGridMapsOrder = useVttGridMapStore((state) => state.order);

	return (
		<GridMapBoardLayerContainer>
			{vttGridMapsOrder.map((id) => (
				<VttGridMapElementWrapper
					key={id}
					vttGridMapId={id}
				/>
			))}
		</GridMapBoardLayerContainer>
	);
});
