import { createContext, ReactNode, useMemo, useState } from "react";

export const CharacterIdContext = createContext<{
	characterId: string;
}>({ characterId: "__CHARACTER_ID_NOT_PROVIDED__" });

interface CharacterIdContextProviderProps {
	characterId: string;
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
