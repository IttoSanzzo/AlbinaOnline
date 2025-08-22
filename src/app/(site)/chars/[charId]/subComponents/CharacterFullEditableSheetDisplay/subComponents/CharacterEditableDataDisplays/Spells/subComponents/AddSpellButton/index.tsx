import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterSpellExpanded, Guid } from "@/libs/stp@types";
import { SpellSelectionCore } from "./subComponents/SpellSelectionCore";
import { StateSwitch } from "@/components/(UTILS)";
import { useState } from "react";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.button(styles.addButton);

interface AddSpellButtonProps {
	characterId: Guid;
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
								children={"Adicionar Spell"}
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
							<SpellSelectionCore
								characterSpells={characterSpells}
								setCharacterSpells={setCharacterSpells}
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
