import { Guid } from "@/libs/stp@types";
import { createContext, ReactNode, useMemo, useState } from "react";

export const CharacterIdContext = createContext<{
	characterId: Guid;
}>({ characterId: Guid.Empty });

interface CharacterIdContextProviderProps {
	characterId: Guid;
	children: ReactNode;
}
export function CharacterIdContextProvider({
	characterId,
	children,
}: CharacterIdContextProviderProps) {
	const characterIdContextValue = useMemo(
		() => ({
			characterId: characterId,
		}),
		[characterId]
	);

	return (
		<CharacterIdContext.Provider value={characterIdContextValue}>
			{children}
		</CharacterIdContext.Provider>
	);
}
