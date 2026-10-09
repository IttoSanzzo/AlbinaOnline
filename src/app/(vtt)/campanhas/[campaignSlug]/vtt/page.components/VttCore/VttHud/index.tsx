"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { EdgeBleed } from "./EdgeBleed";
import { CameraControls } from "./CameraControls";
import { Crosshair } from "./Crosshair";
import { Communication } from "./Communication";
import { DiceHistory } from "./DiceHistory";
import { memo } from "react";
import { BoardLayerSelector } from "./BoardLayerSelector";

const VttHudContainer = newStyledElement.div(styles.vttHudContainer);

export const VttHud = memo(function VttHud() {
	return (
		<VttHudContainer>
			<EdgeBleed />
			<BoardLayerSelector />
			<CameraControls />
			<Communication />
			<DiceHistory />
			<Crosshair />
		</VttHudContainer>
	);
});
