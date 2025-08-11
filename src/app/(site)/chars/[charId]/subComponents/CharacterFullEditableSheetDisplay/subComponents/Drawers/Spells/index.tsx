import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { Guid } from "@/libs/stp@types";

interface SpellsDrawerProps {
	characterId: Guid;
}
export function SpellsDrawer({ characterId }: SpellsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Spells"
			memoryId={`${characterId}-Spells`}>
			<UIBasics.Box
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterEditableDataDisplays.Spells characterId={characterId} />
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
