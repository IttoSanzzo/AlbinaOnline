import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
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
			<CharacterEditableDataDisplays.Traits characterId={characterId} />
			<UIBasics.MultiColumn.Two
				colum1={
					<CharacterEditableDataDisplays.Skills characterId={characterId} />
				}
				colum2={
					<CharacterEditableDataDisplays.Spells characterId={characterId} />
				}
			/>
		</CharacterDrawerBaseHeader>
	);
}
