import { NotionBox, NotionToggleHeader } from "@/components/(NotionBased)";
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
				<CharacterDrawers.ParametersAndAtributeScores
					characterId={characterData.id}
				/>
				<CharacterDrawers.MasteriesAndTests characterId={characterData.id} />
				<CharacterDrawers.SpellDomains
					characterId={characterData.id}
					spellDomains={characterData.spellDomains}
				/>
				<NotionToggleHeader
					title="Outros"
					titleColor="gray"
					backgroundColor="darkGray"
				/>
			</NotionBox>
		</CharacterEditableSheetContextProviders>
	);
}
