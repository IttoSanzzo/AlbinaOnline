import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";

interface SpellsDrawerProps {
	characterId: string;
}
export function SpellsDrawer({ characterId }: SpellsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Spells"
			memoryId={`${characterId}-Spells`}>
			<NotionBox
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterEditableDataDisplays.Spells characterId={characterId} />
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
