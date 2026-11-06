"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { EdgeBleed } from "./EdgeBleed";
import { Crosshair } from "./Crosshair";
import { memo } from "react";
import { useLocalStorageState } from "@/utils/Storage";
import { VttHudGenericButtonA } from "../../Components/VttHudGenericButtonA";
import clsx from "clsx";
import { CenterHud } from "./CenterHud";
import { RightHud } from "./RightHud";

const VttHudFixedContainer = newStyledElement.div(styles.vttHudFixedContainer);
const VttHudLayoutContainer = newStyledElement.div(
	styles.vttHudLayoutContainer,
);
const VttHudCenterContainer = newStyledElement.div(
	styles.vttHudCenterContainer,
);
const VttHudSideContainer = newStyledElement.div(styles.vttHudSideContainer);

export const VttHud = memo(function VttHud() {
	const [isLeftContainerOpen, setIsLeftContainerOpen] = useLocalStorageState(
		"vtt-hud-left-container-open-state",
		false,
	);
	const [isRightContainerOpen, setIsRightContainerOpen] = useLocalStorageState(
		"vtt-hud-right-container-open-state",
		false,
	);

	return (
		<VttHudFixedContainer>
			<EdgeBleed />
			<VttHudLayoutContainer>
				<VttHudSideContainer
					className={styles.leftContainer}
					style={{
						margin: isLeftContainerOpen ? 0 : undefined,
					}}></VttHudSideContainer>
				<VttHudCenterContainer>
					<CenterHud />

					<VttHudGenericButtonA
						className={clsx(styles.sideContainerButton, styles.rightContainer)}
						onClick={() => setIsRightContainerOpen((state) => !state)}
						isActive={isRightContainerOpen}
						stpIconName={"Sidebar"}
					/>
					<VttHudGenericButtonA
						className={clsx(styles.sideContainerButton, styles.leftContainer)}
						onClick={() => setIsLeftContainerOpen((state) => !state)}
						isActive={isLeftContainerOpen}
						stpIconName={"Sidebar"}
					/>
				</VttHudCenterContainer>
				<VttHudSideContainer
					className={styles.rightContainer}
					style={{
						margin: isRightContainerOpen ? 0 : undefined,
					}}>
					<RightHud />
				</VttHudSideContainer>
			</VttHudLayoutContainer>
			<Crosshair />
		</VttHudFixedContainer>
	);
});
