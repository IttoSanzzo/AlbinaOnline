"use client";

import { CharacterExpandedData } from "@/libs/stp@types";
import { ReactNode } from "react";
import { CharacterAbilityScoreContextProvider } from "./contexts/AbilityScore";
import { CharacterIdContextProvider } from "./contexts/CharacterId";
import { CharacterParametersContextProvider } from "./contexts/Parameters";
import { CharacterRaceContextProvider } from "./contexts/Race";
import { MasteriesContextProvider } from "./contexts/Masteries";
import { ItemsContextProvider } from "./contexts/Items";

export { CharacterIdContext } from "./contexts/CharacterId";
export { AbilityScoreContext } from "./contexts/AbilityScore";
export { ParametersContext } from "./contexts/Parameters";
export { RaceContext } from "./contexts/Race";
export { MasteriesContext } from "./contexts/Masteries";

interface CharacterEditableSheetContextProvidersProps {
	data: CharacterExpandedData;
	children?: ReactNode;
}
export function CharacterEditableSheetContextProviders({
	data,
	children,
}: CharacterEditableSheetContextProvidersProps) {
	return (
		<CharacterIdContextProvider characterId={data.id}>
			<CharacterAbilityScoreContextProvider abilityScore={data.abilityScore}>
				<CharacterParametersContextProvider parameters={data.parameters}>
					<CharacterRaceContextProvider race={data.race}>
						<MasteriesContextProvider>
							<ItemsContextProvider>{children}</ItemsContextProvider>
						</MasteriesContextProvider>
					</CharacterRaceContextProvider>
				</CharacterParametersContextProvider>
			</CharacterAbilityScoreContextProvider>
		</CharacterIdContextProvider>
	);
}
