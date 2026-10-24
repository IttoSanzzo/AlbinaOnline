import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { memo } from "react";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { GridMapsModal } from "@/app/(site)/atlas/page.components/GridMapsModal";
import { useVttGridMapStore } from "../../../Stores/VttGridMapStore";
import { VttGridMapElementWrapper } from "./VttGridMapElementWrapper";

const GridMapBoardLayerContainer = newStyledElement.div(
	styles.gridMapBoardLayerContainer,
);

export const GridMapBoardLayer = memo(function GridMapBoardLayer() {
	const isLayerActive = useVttBoardLayerContext((state) =>
		state.isLayerActive(VttBoardLayer.GridMap),
	);
	const vttGridMapsOrder = useVttGridMapStore((state) => state.order);

	return (
		<GridMapBoardLayerContainer>
			{vttGridMapsOrder.map((id) => (
				<VttGridMapElementWrapper
					key={id}
					vttGridMapId={id}
				/>
			))}
			{isLayerActive && <GridMapsModal isInVtt />}
		</GridMapBoardLayerContainer>
	);
});
