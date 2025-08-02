import {
	Notion2Columns,
	NotionBox,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterExpandedData } from "@/libs/stp@types";
import { CharacterEditableSheetContextProviders } from "./subComponents/CharacterEditableSheetContextProviders";
import { CharacterDrawers } from "./subComponents/Drawers";

interface CharacterFullSheetEditableDisplayProps {
	characterData: CharacterExpandedData;
}
export function CharacterFullSheetEditableDisplay({
	characterData,
}: CharacterFullSheetEditableDisplayProps) {
	return (
		<CharacterEditableSheetContextProviders data={characterData}>
			<NotionBox
				backgroundColor="gray"
				withoutBorder>
				<Notion2Columns
					withoutPadding
					withoutGap
					withoutBorderRadius
					colum1={<CharacterDrawers.Skills characterId={characterData.id} />}
					colum2={
						<CharacterDrawers.Spells
							// characterSpells={characterData.acquiredSpells}
							characterId={characterData.id}
						/>
					}
				/>
				<CharacterDrawers.ParametersAndAtributeScores
					characterId={characterData.id}
				/>
				<CharacterDrawers.MasteriesAndTests characterId={characterData.id} />
				<CharacterDrawers.SpellDomains
					characterId={characterData.id}
					spellDomains={characterData.spellDomains}
				/>
				<CharacterDrawers.Others
					characterId={characterData.id}
					characterProfile={characterData.profile}
					characterBackstory={characterData.backstory.history}
				/>
			</NotionBox>
		</CharacterEditableSheetContextProviders>
	);
}
