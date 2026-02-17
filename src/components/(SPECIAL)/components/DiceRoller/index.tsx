"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dialog } from "@/libs/stp@radix";
import Image from "next/image";
import DiceRollerCrop from "@/../public/general-assets/DiceRollerCrop.png";
import { StandartTextColor } from "@/components/(UIBasics)";
import { DiceRollerCore } from "./subcomponents/DiceRollerCore";
import { CSSProperties } from "react";
import GearGearCrop from "@/../public/general-assets/GearGearCrop.png";
import { useState } from "react";

const DiceRollerContainer = newStyledElement.div(styles.diceRollerContainer);
const DiceRollerTriggerButton = newStyledElement.button(
	styles.diceRollerTriggerButton,
);
const CloseButton = newStyledElement.button(styles.closeButton);

export type StandartDiceSideValue = 2 | 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface DiceRollerProps {
	position?: "top";
}
export function DiceRoller({ position }: DiceRollerProps) {
	const [openState, setOpenState] = useState<boolean>(false);

	const containerPositionStyle: CSSProperties | undefined =
		position !== "top"
			? undefined
			: {
					position: "fixed",
					top: 0,
					left: "0",
				};

	return (
		<DiceRollerContainer style={containerPositionStyle}>
			<Dialog.Root open={openState}>
				<Dialog.Trigger asChild>
					<DiceRollerTriggerButton
						onClick={() => {
							setOpenState(true);
						}}>
						<Image
							src={DiceRollerCrop}
							alt="Dice Roller"
							width={50}
							height={50}
							priority
						/>
					</DiceRollerTriggerButton>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay
						className={styles.overlay}
						onClick={() => {
							setOpenState(false);
						}}>
						<Dialog.Content
							className={styles.content}
							onClick={(event) => {
								event.stopPropagation();
							}}>
							<Dialog.Title
								textAlign="center"
								style={{ color: StandartTextColor.orange }}
								children={"Dice Roller"}
							/>
							<DiceRollerCore
								mode="simple"
								primaryColor={StandartTextColor.orange}
								secondaryColor={StandartTextColor.darkGray}
							/>
							<Dialog.Description />
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
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</DiceRollerContainer>
	);
}
