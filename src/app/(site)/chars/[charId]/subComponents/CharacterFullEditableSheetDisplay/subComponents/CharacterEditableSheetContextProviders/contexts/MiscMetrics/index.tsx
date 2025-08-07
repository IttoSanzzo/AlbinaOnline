import { createContext, ReactNode, useMemo, useState } from "react";
import { CharacterMiscMetrics } from "@/libs/stp@types";

export const MiscMetricsContext = createContext<{
	miscMetrics: CharacterMiscMetrics;
	setMiscMetrics: React.Dispatch<React.SetStateAction<CharacterMiscMetrics>>;
}>(undefined!);

interface CharacterMiscMetricsContextProviderProps {
	miscMetrics: CharacterMiscMetrics;
	children: ReactNode;
}
export function CharacterMiscMetricsContextProvider({
	miscMetrics,
	children,
}: CharacterMiscMetricsContextProviderProps) {
	const miscMetricsState = useState<CharacterMiscMetrics>(miscMetrics);
	const miscMetricsContextValue = useMemo(
		() => ({
			miscMetrics: miscMetricsState[0],
			setMiscMetrics: miscMetricsState[1],
		}),
		[miscMetricsState[0]]
	);

	return (
		<MiscMetricsContext.Provider value={miscMetricsContextValue}>
			{children}
		</MiscMetricsContext.Provider>
	);
}
