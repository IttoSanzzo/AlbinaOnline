import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterTraitExpanded, Guid } from "@/libs/stp@types";
import { TraitSelectionCore } from "./subComponents/TraitSelectionCore";
import { useState } from "react";
import { StateSwitch } from "@/components/(UTILS)";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.button(styles.addButton);

interface AddTraitButtonProps {
	characterId: Guid;
	characterTraits: CharacterTraitExpanded[];
	setCharacterTraits: React.Dispatch<
		React.SetStateAction<CharacterTraitExpanded[]>
	>;
}
export function AddTraitButton({
	characterId,
	characterTraits,
	setCharacterTraits,
}: AddTraitButtonProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [inBulkMode, setInBulkMode] = useState<boolean>(false);

	return (
		<ButtonContainer>
			<Dialog.Root
				open={openState}
				onOpenChange={setOpenState}>
				<Dialog.Trigger asChild>
					<AddButton>{StpIcon({ name: "PlusCircle" })}</AddButton>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content maxWidth={1000}>
							<DialogDescription />
							<Dialog.Title
								children={"Adicionar Traço"}
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
							<TraitSelectionCore
								characterTraits={characterTraits}
								setCharacterTraits={setCharacterTraits}
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
