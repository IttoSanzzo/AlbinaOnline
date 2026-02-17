"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import Image from "next/image";
import GearBroadcastCrop from "@/../public/general-assets/GearBroadcastCrop.png";
import GearGearCrop from "@/../public/general-assets/GearGearCrop.png";
import { UIBasics } from "@/components/(UIBasics)";
import { AlbinaBroadcast } from "@/app/embed/broadcast/subComponents/AlbinaBroadcast";
import { DiceRoller } from "../DiceRoller";
import { useState } from "react";

const BroadcastViewerContainer = newStyledElement.div(
	styles.broadcastViewerContainer,
);
const BroadcastViewerTriggerButton = newStyledElement.button(
	styles.broadcastViewerTriggerButton,
);
const BroadcastViewerOverlay = newStyledElement.div(styles.overlay);
const BroadcastViewerContent = newStyledElement.div(styles.content);
const CloseButton = newStyledElement.button(styles.closeButton);

export function BroadcastViewer() {
	const [openState, setOpenState] = useState<boolean>(false);
	const [opened, setOpened] = useState<boolean>(false);

	return (
		<BroadcastViewerContainer>
			<BroadcastViewerTriggerButton
				onClick={() => {
					setOpenState(true);
					setOpened(true);
				}}>
				<Image
					src={GearBroadcastCrop}
					alt="Table Broadcast"
					width={50}
					height={50}
					priority
				/>
			</BroadcastViewerTriggerButton>
			{opened && (
				<BroadcastViewerOverlay
					style={
						openState
							? undefined
							: {
									display: "none",
									pointerEvents: "none",
									border: "1px solid red",
								}
					}
					className={styles.overlay}
					onClick={() => {
						setOpenState(false);
					}}>
					<BroadcastViewerContent
						className={styles.content}
						onClick={(event) => {
							event.stopPropagation();
						}}>
						<UIBasics.Box
							backgroundColor="yellow"
							withoutPadding
							withoutMargin>
							<AlbinaBroadcast />
							<DiceRoller position="top" />
							<CloseButton
								onClick={() => {
									setOpenState(false);
								}}>
								<Image
									src={GearGearCrop}
									alt="Close Broadcast"
									width={50}
									height={50}
									priority
								/>
							</CloseButton>
						</UIBasics.Box>
					</BroadcastViewerContent>
				</BroadcastViewerOverlay>
			)}
		</BroadcastViewerContainer>
	);
}
