import { createContext, ReactNode, useMemo, useState } from "react";
import { CharacterAbilityScore } from "@/libs/stp@types";

export const AbilityScoreContext = createContext<{
	abilityScore: CharacterAbilityScore;
	setAbilityScore: React.Dispatch<React.SetStateAction<CharacterAbilityScore>>;
}>(undefined!);

interface CharacterAbilityScoreContextProviderProps {
	abilityScore: CharacterAbilityScore;
	children: ReactNode;
}
export function CharacterAbilityScoreContextProvider({
	abilityScore,
	children,
}: CharacterAbilityScoreContextProviderProps) {
	const abilityScoreState = useState<CharacterAbilityScore>(abilityScore);
	const abilityScoreContextValue = useMemo(
		() => ({
			abilityScore: abilityScoreState[0],
			setAbilityScore: abilityScoreState[1],
		}),
		[abilityScoreState[0]]
	);

	return (
		<AbilityScoreContext.Provider value={abilityScoreContextValue}>
			{children}
		</AbilityScoreContext.Provider>
	);
}
