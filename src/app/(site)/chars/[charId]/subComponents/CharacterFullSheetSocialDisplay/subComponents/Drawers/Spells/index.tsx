import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import { Guid } from "@/libs/stp@types";

interface SpellsDrawerProps {
	characterId: Guid;
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
				<CharacterDataDisplays.Spells characterId={characterId} />
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
