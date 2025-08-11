import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
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
			<UIBasics.Box
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterDataDisplays.Spells characterId={characterId} />
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
