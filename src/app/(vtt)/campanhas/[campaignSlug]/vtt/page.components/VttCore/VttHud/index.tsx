import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { EdgeBleed } from "./EdgeBleed";
import { CameraControls } from "./CameraControls";
import { Crosshair } from "./Crosshair";

const VttHudContainer = newStyledElement.div(styles.vttHudContainer);

export function VttHud() {
	return (
		<VttHudContainer>
			<EdgeBleed />
			<CameraControls />
			<Crosshair />
		</VttHudContainer>
	);
}
