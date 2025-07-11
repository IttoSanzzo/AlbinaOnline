import { AlertDialog, DropdownMenu } from "@/libs/stp@radix";
import { DeleteCharForm } from "./DeleteCharForm";
import {
	useCurrentCharacterAccessLevel,
	useCurrentPageData,
} from "@/libs/stp@hooks";
import { AccessLevel } from "@/libs/stp@types/otherTypes/AccessLevel";

export function DeleteCharMenuItem() {
	const currentCharacterAccessLevel = useCurrentCharacterAccessLevel();
	const { data, type, isSet } = useCurrentPageData();
	if (
		currentCharacterAccessLevel.isSet == false ||
		currentCharacterAccessLevel.accessLevel < AccessLevel.Owner ||
		isSet == false ||
		type != "Character" ||
		!data
	)
		return null;

	return (
		<AlertDialog.Root>
			<DropdownMenu.AlertDialogTrigger
				iconProps={{ name: "Trash", style: "bold", color: "red" }}>
				Deletar ficha
			</DropdownMenu.AlertDialogTrigger>

			<AlertDialog.Portal>
				<AlertDialog.Overlay />
				<AlertDialog.Content>
					<AlertDialog.Title style={{ marginBottom: 20 }}>
						Deletar Personagem
					</AlertDialog.Title>
					<AlertDialog.Description>
						Esse processo é definitivo e simplesmente não pode ser desfeito.
						Tenha absoluta certeza do que está fazendo.
					</AlertDialog.Description>

					<DeleteCharForm
						characterName={data.name}
						characterId={data.id}
					/>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
