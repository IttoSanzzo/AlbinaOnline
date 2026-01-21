import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dialog } from "@/libs/stp@radix";
import Image from "next/image";
import DiceRollerCrop from "@/../public/general-assets/DiceRollerCrop.png";
import { StandartTextColor } from "@/components/(UIBasics)";
import { DiceRollerCore } from "./subcomponents/DiceRollerCore";

const DiceRollerContainer = newStyledElement.div(styles.diceRollerContainer);
const DiceRollerTriggerButton = newStyledElement.button(
	styles.diceRollerTriggerButton,
);

export type StandartDiceSideValue = 2 | 4 | 6 | 8 | 10 | 12 | 20 | 100;

export function DiceRoller() {
	return (
		<DiceRollerContainer>
			<Dialog.Root open={undefined}>
				<Dialog.Trigger asChild>
					<DiceRollerTriggerButton>
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
					<Dialog.Overlay className={styles.overlay}>
						<Dialog.Content className={styles.content}>
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
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</DiceRollerContainer>
	);
}
