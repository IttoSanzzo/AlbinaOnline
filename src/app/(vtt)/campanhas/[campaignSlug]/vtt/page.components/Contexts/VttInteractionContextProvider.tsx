"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { VttInteractionType } from "../Types/VttMouseState";

export interface VttInteraction {
	type: VttInteractionType;
	allowMiddlePan: boolean;
	allowEdgeScroll: boolean;
}

interface VttInteractionContext {
	interaction: VttInteraction;
	hoverInteractionType: VttInteractionType | null;

	setInteraction: (interaction: VttInteraction) => void;
	setHoverInteractionType: (
		hoverInteractionType: VttInteractionType | null,
	) => void;
	clearInteraction: () => void;
}
const DEFAULT_INTERACTION: VttInteraction = {
	type: "Default",
	allowMiddlePan: true,
	allowEdgeScroll: false,
};

const VttInteractionContext = createContext<VttInteractionContext | null>(null);

interface VttInteractionContextProviderProps {
	children: ReactNode;
}
export function VttInteractionContextProvider({
	children,
}: VttInteractionContextProviderProps) {
	const [interaction, setInteractionState] =
		useState<VttInteraction>(DEFAULT_INTERACTION);
	const [hoverInteractionType, setHoverInteractionType] =
		useState<VttInteractionType | null>(null);

	const clearInteraction = () => {
		setInteractionState(DEFAULT_INTERACTION);
	};

	const contextValue: VttInteractionContext = {
		interaction,
		hoverInteractionType,
		setInteraction: setInteractionState,
		setHoverInteractionType: setHoverInteractionType,
		clearInteraction,
	};

	return (
		<VttInteractionContext.Provider value={contextValue}>
			{children}
		</VttInteractionContext.Provider>
	);
}

export function useVttInteractionContext(): VttInteractionContext {
	const context = useContext(VttInteractionContext);
	if (!context)
		throw new Error(
			"useVttInteractionContext must be used inside a VttInteractionContextProvider.",
		);
	return context;
}
