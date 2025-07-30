import { createContext, ReactNode, useMemo, useState } from "react";
import { CharacterMasteryExpanded } from "@/libs/stp@types";

export const MasteriesContext = createContext<{
	masteries: CharacterMasteryExpanded[];
	setMasteries: React.Dispatch<
		React.SetStateAction<CharacterMasteryExpanded[]>
	>;
}>({
	masteries: [],
	setMasteries: () => {
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
			masteries: masteriesState[0],
			setMasteries: masteriesState[1],
		}),
		[masteriesState[0]]
	);

	return (
		<MasteriesContext.Provider value={masteriesContextValue}>
			{children}
		</MasteriesContext.Provider>
	);
}
