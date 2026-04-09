import { CharacterExpandedData } from "@/libs/stp@types";
import { CharacterEditableSheetContextProviders } from "./subComponents/CharacterEditableSheetContextProviders";
import { CharacterDrawers } from "./subComponents/Drawers";
import { CharacterHeader } from "./subComponents/CharacterHeader";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/subComponents/DynamicGallery";

interface CharacterFullSheetEditableDisplayProps {
	characterData: CharacterExpandedData;
}
export function CharacterFullSheetEditableDisplay({
	characterData,
}: CharacterFullSheetEditableDisplayProps) {
	return (
		<CharacterEditableSheetContextProviders data={characterData}>
			<CharacterHeader
				level={characterData.level}
				race={characterData.race}
			/>
			<UIBasics.Box
				backgroundColor="gray"
				withoutBorder>
				<CharacterDrawers.Inventory
					characterId={characterData.id}
					characterCoinStacks={characterData.coinStacks}
				/>
				<CharacterDrawers.Statistics
					characterId={characterData.id}
					characterActionsPool={characterData.actionsPool}
				/>
				<CharacterDrawers.TraitsSkillsSpells characterId={characterData.id} />
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
				<DynamicGallery
					url={getAlbinaApiFullAddress(`/images/chars/${characterData.id}`)}
					withoutMargin
				/>
			</UIBasics.Box>
		</CharacterEditableSheetContextProviders>
	);
}
