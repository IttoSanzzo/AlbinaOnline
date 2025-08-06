import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterSkillExpanded, Guid } from "@/libs/stp@types";
import { SkillSelectionCore } from "./subComponents/SkillSelectionCore";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.button(styles.addButton);

interface AddSkillButtonProps {
	characterId: Guid;
	characterSkills: CharacterSkillExpanded[];
	setCharacterSkills: React.Dispatch<
		React.SetStateAction<CharacterSkillExpanded[]>
	>;
}
export function AddSkillButton({
	characterId,
	characterSkills,
	setCharacterSkills,
}: AddSkillButtonProps) {
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
							<SkillSelectionCore
								characterSkills={characterSkills}
								setCharacterSkills={setCharacterSkills}
								characterId={characterId}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
