"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface VttGridSetting {
	primaryColor: string;
	secondaryColor: string;
	primaryBorderWidth: number;
	secondaryBorderWidth: number;
	primaryOpacity: number;
	secondaryOpacity: number;
}

interface VttGridContext {
	grid: VttGridSetting;
	setGrid: (grid: VttGridSetting) => void;
}

export const DEFAULT_GRID_CELL_SIZE = 100;
const DEFAULT_GRID: VttGridSetting = {
	primaryColor: "#FFFFFF",
	primaryBorderWidth: 1,
	primaryOpacity: 0.2,

	secondaryColor: "#000000",
	secondaryBorderWidth: 1,
	secondaryOpacity: 1,
};

const VttGridContext = createContext<VttGridContext | null>(null);

interface VttGridContextProviderProps {
	children: ReactNode;
}

export function VttGridContextProvider({
	children,
}: VttGridContextProviderProps) {
	const [grid, setGrid] = useState<VttGridSetting>(DEFAULT_GRID);

	const contextValue: VttGridContext = {
		grid,
		setGrid,
	};
	return (
		<VttGridContext.Provider value={contextValue}>
			{children}
		</VttGridContext.Provider>
	);
}

export function useVttGridContext(): VttGridContext {
	const context = useContext(VttGridContext);
	if (!context)
		throw new Error(
			"useVttGridContext must be used inside a VttGridContextProvider.",
		);
	return context;
}
