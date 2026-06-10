import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CSSProperties, useState } from "react";
import { NotesEditionCore } from "../../../../../../../../../../../components/(UTILS)/components/NotesEditionCore";
import { Guid } from "@/libs/stp@types";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const EditButton = newStyledElement.button(styles.editButton);

interface EditTraitNotesButtonProps {
	characterId: Guid;
	skillId: Guid;
	notes: string;
	style?: CSSProperties;
}
export function EditTraitNotesButton({
	characterId,
	skillId,
	notes,
	style,
}: EditTraitNotesButtonProps) {
	const [openState, setOpenState] = useState<boolean>(false);

	return (
		<ButtonContainer style={style}>
			<Dialog.Root
				open={openState}
				onOpenChange={setOpenState}>
				<Dialog.Trigger asChild>
					<EditButton>{StpIcon({ name: "Pen" })}</EditButton>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content maxWidth={1000}>
							<DialogDescription />
							<Dialog.Title
								children={"Editar Notas"}
								marginBottom={20}
								textAlign="center"
							/>
							<NotesEditionCore
								characterId={characterId}
								entityId={skillId}
								targetType="trait"
								defaultValue={notes}
								setOpenState={setOpenState}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}
