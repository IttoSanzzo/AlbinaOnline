import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import {
	CharacterAbilityScore,
	CharacterMasteryExpanded,
	Guid,
} from "@/libs/stp@types";
import React from "react";

interface MasteriesAndTestsDrawerProps {
	characterId: Guid;
	characterMasteries: CharacterMasteryExpanded[];
	abilityScore: CharacterAbilityScore;
}
export function MasteriesAndTestsDrawer({
	characterId,
	characterMasteries,
	abilityScore,
}: MasteriesAndTestsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Maestrias & Testes"
			memoryId={`${characterId}-MasteriesAndTests`}
			backgroundColor="blue">
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
