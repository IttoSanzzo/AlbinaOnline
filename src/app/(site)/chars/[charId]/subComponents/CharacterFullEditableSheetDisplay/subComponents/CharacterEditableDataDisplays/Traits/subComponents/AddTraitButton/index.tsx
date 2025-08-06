import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterTraitExpanded, Guid } from "@/libs/stp@types";
import { TraitSelectionCore } from "./subComponents/TraitSelectionCore";

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
	return (
		<ButtonContainer>
			<Dialog.Root>
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
							<TraitSelectionCore
								characterTraits={characterTraits}
								setCharacterTraits={setCharacterTraits}
								characterId={characterId}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
