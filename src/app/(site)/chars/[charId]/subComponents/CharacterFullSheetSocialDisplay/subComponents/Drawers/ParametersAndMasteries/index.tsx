import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import {
	CharacterAbilityScore,
	CharacterMasteryExpanded,
	CharacterParameters,
	Guid,
	RaceData,
} from "@/libs/stp@types";

interface ParametersAndMasteriesDrawerProps {
	characterId: Guid;
	characterMasteries: CharacterMasteryExpanded[];
	abilityScore: CharacterAbilityScore;
	parameters: CharacterParameters;
	race: RaceData;
}
export function ParametersAndMasteriesDrawer({
	characterId,
	characterMasteries,
	abilityScore,
	parameters,
	race,
}: ParametersAndMasteriesDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Parâmetros & Maestrias"
			memoryId={`${characterId}-ParametersAndMasteries`}
			backgroundColor="blue">
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
			<UIBasics.MultiColumn.Two
				colum1={
					<CharacterDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Proficiency"}
						abilityScore={abilityScore}
						characterMasteries={characterMasteries}
					/>
				}
				colum2={
					<CharacterDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Craft"}
						abilityScore={abilityScore}
						characterMasteries={characterMasteries}
					/>
				}
			/>
			<UIBasics.MultiColumn.Two
				colum1={
					<CharacterDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Expertise"}
						abilityScore={abilityScore}
						characterMasteries={characterMasteries}
					/>
				}
				colum2={
					<CharacterDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Knowledge"}
						abilityScore={abilityScore}
						characterMasteries={characterMasteries}
					/>
				}
			/>
		</CharacterDrawerBaseHeader>
	);
}
