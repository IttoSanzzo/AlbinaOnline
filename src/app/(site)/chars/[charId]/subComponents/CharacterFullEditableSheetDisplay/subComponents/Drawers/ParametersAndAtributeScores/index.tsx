import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { Notion2Columns } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";

interface ParametersAndAtributeScoresDrawerProps {
	characterId: string;
}
export function ParametersAndAtributeScoresDrawer({
	characterId,
}: ParametersAndAtributeScoresDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Parâmetros & Atributos"
			memoryId={`${characterId}-ParametersAndAttributes`}
			backgroundColor="red">
			<Notion2Columns
				colum1={<CharacterEditableDataDisplays.Parameters />}
				colum2={<CharacterEditableDataDisplays.AbilityScore />}
			/>
		</CharacterDrawerBaseHeader>
	);
}
