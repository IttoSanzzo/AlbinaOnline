import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CharacterMiscMetrics, Guid, MagicAttribute } from "@/libs/stp@types";
import { Dispatch, SetStateAction } from "react";
import { AttributeSelectionCore } from "./subComponents/AttributeSelectionCore";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.button(styles.addButton);

interface AddAttributeButtonProps {
	characterId: Guid;
	alreadyHasAttributes: (keyof typeof MagicAttribute)[];
	miscMetrics: CharacterMiscMetrics;
	setMiscMetrics: Dispatch<SetStateAction<CharacterMiscMetrics>>;
}
export function AddAttributeButton({
	characterId,
	alreadyHasAttributes,
	miscMetrics,
	setMiscMetrics,
}: AddAttributeButtonProps) {
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
								children={`Atributos mágicos disponíveis`}
								marginBottom={20}
								textAlign="center"
							/>
							<AttributeSelectionCore
								characterId={characterId}
								alreadyHasAttributes={alreadyHasAttributes}
								miscMetrics={miscMetrics}
								setMiscMetrics={setMiscMetrics}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
