import { createContext, ReactNode, useMemo, useState } from "react";
import { CharacterMasteryExpanded } from "@/libs/stp@types";

export const MasteriesContext = createContext<{
	characterMasteries: CharacterMasteryExpanded[];
	setCharacterMasteries: React.Dispatch<
		React.SetStateAction<CharacterMasteryExpanded[]>
	>;
}>({
	characterMasteries: [],
	setCharacterMasteries: () => {
		throw new Error("setMasteries called outside of provider");
	},
});

interface MasteriesContextProviderProps {
	children: ReactNode;
}
export function MasteriesContextProvider({
	children,
}: MasteriesContextProviderProps) {
	const masteriesState = useState<CharacterMasteryExpanded[]>([]);
	const masteriesContextValue = useMemo(
		() => ({
			characterMasteries: masteriesState[0],
			setCharacterMasteries: masteriesState[1],
		}),
		[masteriesState[0]]
	);

	return (
		<MasteriesContext.Provider value={masteriesContextValue}>
			{children}
		</MasteriesContext.Provider>
	);
}
