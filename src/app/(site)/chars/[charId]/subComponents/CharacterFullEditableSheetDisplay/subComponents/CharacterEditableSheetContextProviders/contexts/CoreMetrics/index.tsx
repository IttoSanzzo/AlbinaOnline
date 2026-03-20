import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { CharacterCoreMetrics } from "@/libs/stp@types";

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
	const coreMetricsContextValue = useMemo(
		() => ({
			coreMetrics: coreMetricsState[0],
			setCoreMetrics: coreMetricsState[1],
		}),
		[coreMetricsState[0]],
	);

	useEffect(() => {
		coreMetricsState[1](coreMetrics);
	}, [coreMetrics]);

	return (
		<CoreMetricsContext.Provider value={coreMetricsContextValue}>
			{children}
		</CoreMetricsContext.Provider>
	);
}
