import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import {
	CharacterAbilityScore,
	CharacterParameters,
	Guid,
	RaceData,
} from "@/libs/stp@types";

interface ParametersAndAtributeScoresDrawerProps {
	characterId: Guid;
	parameters: CharacterParameters;
	abilityScore: CharacterAbilityScore;
	race: RaceData;
}
export function ParametersAndAtributeScoresDrawer({
	characterId,
	parameters,
	abilityScore,
	race,
}: ParametersAndAtributeScoresDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Parâmetros & Atributos"
			memoryId={`${characterId}-ParametersAndAttributes`}
			backgroundColor="red">
			<UIBasics.MultiColumn.Two
				colum1={
					<CharacterDataDisplays.Parameters
						parameters={parameters}
						race={race}
					/>
				}
				colum2={
					<CharacterDataDisplays.AbilityScore abilityScore={abilityScore} />
				}
			/>
		</CharacterDrawerBaseHeader>
	);
}
