import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import {
	useVttBoardLayerStore,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { GridMapLayerTab } from "./GridMapLayerTab";

const RightHudContainer = newStyledElement.div(styles.rightHudContainer);

export function RightHud() {
	const activeLayer = useVttBoardLayerStore((state) => state.activeLayer);

	return (
		<RightHudContainer>
			{activeLayer == VttBoardLayer.GridMap && <GridMapLayerTab />}
		</RightHudContainer>
	);
}
