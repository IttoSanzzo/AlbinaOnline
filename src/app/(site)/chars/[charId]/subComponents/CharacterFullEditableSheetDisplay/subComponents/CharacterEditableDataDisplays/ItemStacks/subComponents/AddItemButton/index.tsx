import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterItemStackExpanded, Guid } from "@/libs/stp@types";
import { ItemSelectionCore } from "./subComponents/ItemSelectionCore";
import { useState } from "react";
import { StateSwitch } from "@/components/(UTILS)";

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
								children={"Adicionar Item"}
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
							<ItemSelectionCore
								characterId={characterId}
								characterItems={characterItems}
								setCharacterItems={setCharacterItems}
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
