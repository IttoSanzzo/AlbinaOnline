import { NotionBox, NotionToggleHeader } from "@/components/(NotionBased)";
import { CharacterDataEditableDisplays } from "./CharacterDataEditableDisplays";
import { CharacterExpandedData } from "@/libs/stp@types";

interface CharacterFullSheetEditableDisplayProps {
	characterData: CharacterExpandedData;
}
export function CharacterFullSheetEditableDisplay({
	characterData,
}: CharacterFullSheetEditableDisplayProps) {
	return (
		<>
			<NotionBox
				backgroundColor="gray"
				withoutBorder>
				<NotionToggleHeader
					title="Estatísticas"
					titleColor="gray"
					backgroundColor="darkGray"
				/>
				<NotionToggleHeader
					title="Maestrias & Testes"
					titleColor="gray"
					backgroundColor="darkGray"
				/>
				<CharacterDataEditableDisplays.SpellDomains
					characterId={characterData.id}
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
