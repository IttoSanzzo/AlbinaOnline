import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterSpellExpanded } from "@/libs/stp@types";
import { SpellSelectionCore } from "./subComponents/SpellSelectionCore";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.button(styles.addButton);

interface AddSpellButtonProps {
	characterId: string;
	characterSpells: CharacterSpellExpanded[];
	setCharacterSpells: React.Dispatch<
		React.SetStateAction<CharacterSpellExpanded[]>
	>;
}
export function AddSpellButton({
	characterId,
	characterSpells,
	setCharacterSpells,
}: AddSpellButtonProps) {
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
								children={"Adicionar Spell"}
								marginBottom={20}
								textAlign="center"
							/>
							<SpellSelectionCore
								characterSpells={characterSpells}
								setCharacterSpells={setCharacterSpells}
								characterId={characterId}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
