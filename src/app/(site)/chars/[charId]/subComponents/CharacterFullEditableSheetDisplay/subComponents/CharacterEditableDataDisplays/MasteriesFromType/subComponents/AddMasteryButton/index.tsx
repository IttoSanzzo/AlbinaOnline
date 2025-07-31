import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import {
	CharacterMasteryExpanded,
	masteryNames,
	MasteryType,
} from "@/libs/stp@types";
import { Dialog } from "@/libs/stp@radix";
import { MasterySelectionCore } from "./subComponents/MasterySelectionCore";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface AddMasteryButtonProps {
	type: keyof typeof MasteryType;
	characterId: string;
	masteries: CharacterMasteryExpanded[];
}
export function AddMasteryButton({
	type,
	characterId,
	masteries,
}: AddMasteryButtonProps) {
	return (
		<ButtonContainer>
			<Dialog.Root>
				<Dialog.Trigger asChild>
					{StpIcon({ name: "PlusCircle" })}
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content maxWidth={1000}>
							<DialogDescription />
							<Dialog.Title
								children={`${masteryNames[type]}s`}
								marginBottom={20}
								textAlign="center"
							/>
							<MasterySelectionCore
								characterMasteries={masteries}
								type={type}
								characterId={characterId}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
