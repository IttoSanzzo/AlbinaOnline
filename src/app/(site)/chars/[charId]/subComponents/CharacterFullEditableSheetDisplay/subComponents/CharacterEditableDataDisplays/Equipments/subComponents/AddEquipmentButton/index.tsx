import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterEquipments, EquipmentSlot, Guid } from "@/libs/stp@types";
import { EquipmentSelectionCore } from "./subComponents/EquipmentSelectionCore";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.button(styles.addButton);

interface AddEquipmentButtonProps {
	characterId: Guid;
	setCharacterEquipments: React.Dispatch<
		React.SetStateAction<CharacterEquipments>
	>;
	slot: EquipmentSlot;
	title: string;
	alreadyHasItemIds?: Guid[];
}
export function AddEquipmentButton({
	characterId,
	setCharacterEquipments,
	slot,
	title,
	alreadyHasItemIds = [],
}: AddEquipmentButtonProps) {
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
								children={`Equipamentos para ${title.toLocaleLowerCase()} disponíveis`}
								marginBottom={20}
								textAlign="center"
							/>
							<EquipmentSelectionCore
								characterId={characterId}
								setCharacterEquipments={setCharacterEquipments}
								slot={slot}
								alreadyHasItemIds={alreadyHasItemIds}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
