import styles from "./index.module.css";
import { BoardLayerSelector } from "./TopRight/BoardLayerSelector";
import { CameraControls } from "./CameraControls";
import { Communication } from "./Communication";
import { DiceHistory } from "./DiceHistory";
import { newStyledElement } from "@setsu-tp/styled-components";
import { LayerContextualButtonsTopRight } from "./TopRight/LayerContextualButtonsTopRight";
import { HotBar } from "./HotBar";
import { ConnectedPlayers } from "./ConnectedPlayers";

const CenterHudContainer = newStyledElement.div(styles.centerHudContainer);
const HudVerticalGenericButtonContainer = newStyledElement.div(
	styles.hudVerticalGenericButtonContainer,
);

export function CenterHud() {
	return (
		<CenterHudContainer>
			<HudVerticalGenericButtonContainer className={styles.containerTopRight}>
				<BoardLayerSelector />
				<LayerContextualButtonsTopRight />
			</HudVerticalGenericButtonContainer>
			<CameraControls />
			<HotBar />
			<Communication />
			<ConnectedPlayers />
			<DiceHistory />
		</CenterHudContainer>
	);
}
