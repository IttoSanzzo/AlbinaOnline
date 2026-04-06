import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import { Guid } from "@/libs/stp@types";

interface TraitsSkillsSpellsDrawerProps {
	characterId: Guid;
}
export function TraitsSkillsSpellsDrawer({
	characterId,
}: TraitsSkillsSpellsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Traços & Skills & Spells"
			memoryId={`${characterId}-TraitsSkillsSpells`}>
			<CharacterDataDisplays.Traits characterId={characterId} />
			<UIBasics.MultiColumn.Two
				colum1={<CharacterDataDisplays.Skills characterId={characterId} />}
				colum2={<CharacterDataDisplays.Spells characterId={characterId} />}
			/>
		</CharacterDrawerBaseHeader>
	);
}
