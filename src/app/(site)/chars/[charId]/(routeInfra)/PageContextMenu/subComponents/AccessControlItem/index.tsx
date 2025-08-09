import { Dialog, DropdownMenu } from "@/libs/stp@radix";
import {
	useCurrentCharacterAccessLevel,
	useCurrentPageData,
} from "@/libs/stp@hooks";
import { AccessLevel } from "@/libs/stp@types/otherTypes/AccessLevel";
import { OwnershipTransfer } from "./subComponents/OwnershipTransfer";
import { CharacterData } from "@/libs/stp@types";
import { OtherUsersAccessControl } from "./subComponents/OtherUsersAccesControl";
import { newStyledElement } from "@setsu-tp/styled-components";

export function AccessControlItem() {
	const currentCharacterAccessLevel = useCurrentCharacterAccessLevel();
	const { data, type, isSet } = useCurrentPageData();
	if (
		currentCharacterAccessLevel.isSet == false ||
		currentCharacterAccessLevel.accessLevel < AccessLevel.CoOwner ||
		isSet == false ||
		type != "character" ||
		!data
	)
		return null;

	return (
		<Dialog.Root>
			<DropdownMenu.DialogTrigger
				iconProps={{ name: "Key", style: "bold", color: "yellow" }}>
				Controle de acesso
			</DropdownMenu.DialogTrigger>

			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content maxWidth={"75vw"}>
					<Dialog.Title style={{ marginBottom: 20 }}>
						Controle de Acesso
					</Dialog.Title>
					<Dialog.Description />
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
						{currentCharacterAccessLevel.accessLevel >= AccessLevel.Owner && (
							<OwnershipTransfer
								characterId={data.id}
								ownerId={(data as unknown as CharacterData).ownerId}
								characterName={data.name}
							/>
						)}
						<OtherUsersAccessControl characterId={data.id} />
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
