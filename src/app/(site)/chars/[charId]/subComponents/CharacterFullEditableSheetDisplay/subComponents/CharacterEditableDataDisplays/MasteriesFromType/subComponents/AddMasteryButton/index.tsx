import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import {
	CharacterMasteryExpanded,
	Guid,
	masteryNames,
	MasteryType,
} from "@/libs/stp@types";
import { Dialog } from "@/libs/stp@radix";
import { MasterySelectionCore } from "./subComponents/MasterySelectionCore";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { StateSwitch } from "@/components/(UTILS)";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface AddMasteryButtonProps {
	type: keyof typeof MasteryType;
	characterId: Guid;
	masteries: CharacterMasteryExpanded[];
}
export function AddMasteryButton({
	type,
	characterId,
	masteries,
}: AddMasteryButtonProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [inBulkMode, setInBulkMode] = useState<boolean>(false);

	return (
		<ButtonContainer>
			<Dialog.Root
				open={openState}
				onOpenChange={setOpenState}>
				<Dialog.Trigger asChild>
					{StpIcon({ name: "PlusCircle" })}
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content maxWidth={1000}>
							<DialogDescription />
							<Dialog.Title
								children={`Adicionar ${masteryNames[type]}`}
								marginBottom={20}
								textAlign="center"
							/>
							<StateSwitch
								label={"Bulk"}
								state={[inBulkMode, setInBulkMode]}
								style={{
									position: "absolute",
									top: 0,
									right: 0,
									borderTop: "none",
									borderRight: "none",
								}}
							/>
							<MasterySelectionCore
								characterMasteries={masteries}
								type={type}
								characterId={characterId}
								setOpenState={setOpenState}
								isInBulkMode={inBulkMode}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
