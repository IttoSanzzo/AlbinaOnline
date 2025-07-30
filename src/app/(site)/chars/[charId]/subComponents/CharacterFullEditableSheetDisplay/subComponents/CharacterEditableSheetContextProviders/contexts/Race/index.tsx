import { createContext, ReactNode, useMemo, useState } from "react";
import { RaceData } from "@/libs/stp@types";

export const RaceContext = createContext<{
	race: RaceData;
}>(undefined!);

interface CharacterRaceContextProviderProps {
	race: RaceData;
	children: ReactNode;
}
export function CharacterRaceContextProvider({
	race,
	children,
}: CharacterRaceContextProviderProps) {
	const raceContextValue = useMemo(
		() => ({
			race: race,
		}),
		[race]
	);

	return (
		<RaceContext.Provider value={raceContextValue}>
			{children}
		</RaceContext.Provider>
	);
}
