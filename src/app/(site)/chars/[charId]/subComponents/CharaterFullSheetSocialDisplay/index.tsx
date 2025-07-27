import { NotionBox, NotionToggleHeader } from "@/components/(NotionBased)";
import { CharacterExpandedData } from "@/libs/stp@types";
import { CharacterDataDisplays } from "./subComponents/CharacterDataDisplays";
import { CharacterStatisticsDisplay } from "./subComponents/CharacterStatisticsDisplay";

interface CharacterFullSheetSocialDisplayProps {
	characterData: CharacterExpandedData;
}
export function CharacterFullSheetSocialDisplay({
	characterData,
}: CharacterFullSheetSocialDisplayProps) {
	return (
		<>
			<NotionBox
				backgroundColor="gray"
				withoutBorder>
				<CharacterStatisticsDisplay abilityScore={characterData.abilityScore} />
				<NotionToggleHeader
					title="Maestrias & Testes"
					titleColor="gray"
					backgroundColor="darkGray"
				/>
				<CharacterDataDisplays.SpellDomains
					spellDomains={characterData.spellDomains}
				/>
				<NotionToggleHeader
					title="Outros"
					titleColor="gray"
					backgroundColor="darkGray"
				/>
			</NotionBox>
		</>
	);
}
