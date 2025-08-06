import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterItemStackExpanded, Guid } from "@/libs/stp@types";
import { ItemSelectionCore } from "./subComponents/ItemSelectionCore";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.button(styles.addButton);

interface AddItemButtonProps {
	characterId: Guid;
	characterItems: CharacterItemStackExpanded[];
	setCharacterItems: React.Dispatch<
		React.SetStateAction<CharacterItemStackExpanded[]>
	>;
}
export function AddItemButton({
	characterId,
	characterItems,
	setCharacterItems,
}: AddItemButtonProps) {
	return (
		<ButtonContainer>
			<Dialog.Root>
				<Dialog.Trigger asChild>
					<AddButton>Adicionar{StpIcon({ name: "PlusCircle" })}</AddButton>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content maxWidth={1000}>
							<DialogDescription />
							<Dialog.Title
								children={"Adicionar Skill"}
								marginBottom={20}
								textAlign="center"
							/>
							<ItemSelectionCore
								characterId={characterId}
								characterItems={characterItems}
								setCharacterItems={setCharacterItems}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
