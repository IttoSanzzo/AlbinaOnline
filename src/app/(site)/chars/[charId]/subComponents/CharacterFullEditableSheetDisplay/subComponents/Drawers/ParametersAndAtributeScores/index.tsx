import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { Guid } from "@/libs/stp@types";

interface ParametersAndAtributeScoresDrawerProps {
	characterId: Guid;
}
export function ParametersAndAtributeScoresDrawer({
	characterId,
}: ParametersAndAtributeScoresDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Parâmetros & Atributos"
			memoryId={`${characterId}-ParametersAndAttributes`}
			backgroundColor="red">
			<UIBasics.MultiColumn.Two
				colum1={<CharacterEditableDataDisplays.Parameters />}
				colum2={<CharacterEditableDataDisplays.AbilityScore />}
			/>
		</CharacterDrawerBaseHeader>
	);
}
