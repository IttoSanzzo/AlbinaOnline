"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { EdgeBleed } from "./EdgeBleed";
import { CameraControls } from "./CenterHud/CameraControls";
import { Crosshair } from "./Crosshair";
import { Communication } from "./CenterHud/Communication";
import { DiceHistory } from "./CenterHud/DiceHistory";
import { memo } from "react";
import { BoardLayerSelector } from "./CenterHud/BoardLayerSelector";

const VttHudFixedContainer = newStyledElement.div(styles.vttHudFixedContainer);
const VttHudLayoutContainer = newStyledElement.div(
	styles.vttHudLayoutContainer,
);
const VttHudCenterContainer = newStyledElement.div(
	styles.vttHudCenterContainer,
);
const VttHudSideContainer = newStyledElement.div(styles.vttHudSideContainer);

export const VttHud = memo(function VttHud() {
	return (
		<VttHudFixedContainer>
			<EdgeBleed />
			<VttHudLayoutContainer>
				<VttHudSideContainer></VttHudSideContainer>
				<VttHudCenterContainer>
					<BoardLayerSelector />
					<CameraControls />
					<Communication />
					<DiceHistory />
				</VttHudCenterContainer>
				<VttHudSideContainer></VttHudSideContainer>
			</VttHudLayoutContainer>
			<Crosshair />
		</VttHudFixedContainer>
	);
});
