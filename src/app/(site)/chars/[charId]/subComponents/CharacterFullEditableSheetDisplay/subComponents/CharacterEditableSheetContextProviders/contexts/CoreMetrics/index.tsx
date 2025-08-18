import { createContext, ReactNode, useMemo, useState } from "react";
import { CharacterCoreMetrics, Guid } from "@/libs/stp@types";

export const CoreMetricsContext = createContext<{
	coreMetrics: CharacterCoreMetrics;
	setCoreMetrics: React.Dispatch<React.SetStateAction<CharacterCoreMetrics>>;
}>(undefined!);

interface CharacterCoreMetricsContextProviderProps {
	coreMetrics: CharacterCoreMetrics;
	children: ReactNode;
}
export function CharacterCoreMetricsContextProvider({
	coreMetrics,
	children,
}: CharacterCoreMetricsContextProviderProps) {
	const coreMetricsState = useState<CharacterCoreMetrics>(coreMetrics);
	const id = useState<Guid>(Guid.NewGuid());
	const coreMetricsContextValue = useMemo(
		() => ({
			coreMetrics: coreMetricsState[0],
			setCoreMetrics: coreMetricsState[1],
		}),
		[coreMetricsState[0]]
	);

	return (
		<CoreMetricsContext.Provider value={coreMetricsContextValue}>
			{children}
		</CoreMetricsContext.Provider>
	);
}
