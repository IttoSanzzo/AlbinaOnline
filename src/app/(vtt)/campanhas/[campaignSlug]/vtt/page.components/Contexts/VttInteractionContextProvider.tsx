"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { VttInteractionType } from "../Types/VttMouseState";
import { useVttContext } from "./VttContextProvider";

export interface VttInteraction {
	type: VttInteractionType;
	allowMiddlePan: boolean;
	allowEdgeScroll: boolean;
	edgeScrollOverride: boolean | null;
}

interface VttInteractionContext {
	interaction: VttInteraction;
	hoverInteractionType: VttInteractionType | null;
	setInteraction: (interaction: VttInteraction) => void;
	setHoverInteractionType: (
		hoverInteractionType: VttInteractionType | null,
	) => void;
	setEdgeScrollOverride: (override: boolean | null) => void;
	clearInteraction: () => void;
}

const DEFAULT_INTERACTION: VttInteraction = {
	type: "Default",
	allowMiddlePan: true,
	allowEdgeScroll: false,
	edgeScrollOverride: null,
};

const VttInteractionContext = createContext<VttInteractionContext | null>(null);

interface VttInteractionContextProviderProps {
	children: ReactNode;
}

export function VttInteractionContextProvider({
	children,
}: VttInteractionContextProviderProps) {
	const { activeSceneId } = useVttContext();

	const [interaction, setInteractionState] =
		useState<VttInteraction>(DEFAULT_INTERACTION);

	const [hoverInteractionType, setHoverInteractionType] =
		useState<VttInteractionType | null>(null);

	const setEdgeScrollOverride = (override: boolean | null) => {
		setInteractionState((current) => ({
			...current,
			edgeScrollOverride: override,
		}));
	};

	const clearInteraction = () => {
		setInteractionState(DEFAULT_INTERACTION);
	};

	useEffect(() => {
		clearInteraction();
	}, [activeSceneId]);

	const contextValue: VttInteractionContext = {
		interaction,
		hoverInteractionType,
		setInteraction: setInteractionState,
		setHoverInteractionType,
		setEdgeScrollOverride,
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
