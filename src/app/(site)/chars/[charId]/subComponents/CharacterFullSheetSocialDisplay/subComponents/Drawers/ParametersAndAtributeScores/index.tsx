import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { Notion2Columns } from "@/components/(NotionBased)";
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
			<Notion2Columns
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
