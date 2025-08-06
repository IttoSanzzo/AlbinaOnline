import { createContext, ReactNode, useMemo, useState } from "react";
import { CharacterItemStackExpanded } from "@/libs/stp@types";

export const ItemsContext = createContext<{
	characterItems: CharacterItemStackExpanded[];
	setCharacterItems: React.Dispatch<
		React.SetStateAction<CharacterItemStackExpanded[]>
	>;
}>({
	characterItems: [],
	setCharacterItems: () => {
		throw new Error("setCharacterItems called outside of provider");
	},
});

interface ItemsContextProviderProps {
	children: ReactNode;
}
export function ItemsContextProvider({ children }: ItemsContextProviderProps) {
	const itemsState = useState<CharacterItemStackExpanded[]>([]);
	const itemsContextValue = useMemo(
		() => ({
			characterItems: itemsState[0],
			setCharacterItems: itemsState[1],
		}),
		[itemsState[0]]
	);

	return (
		<ItemsContext.Provider value={itemsContextValue}>
			{children}
		</ItemsContext.Provider>
	);
}
