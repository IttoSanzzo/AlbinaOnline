"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { VttCursorInteractionType } from "../Types/Classes/VttMouseState";
import { useVttContext } from "./VttContextProvider";

export interface VttInteraction {
	type: VttCursorInteractionType;
	allowMiddlePan: boolean;
	allowEdgeScroll: boolean;
	edgeScrollOverride: boolean | null;
}

export interface VttInteractionContextState {
	interaction: VttInteraction;
	hoverInteractionType: VttCursorInteractionType | null;
	setInteraction: (interaction: VttInteraction) => void;
	setHoverInteractionType: (
		hoverInteractionType: VttCursorInteractionType | null,
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

const VttInteractionContext =
	createContext<StoreApi<VttInteractionContextState> | null>(null);

interface VttInteractionContextProviderProps {
	children: ReactNode;
}

function createVttInteractionStore() {
	return createStore<VttInteractionContextState>()((set, get) => ({
		interaction: DEFAULT_INTERACTION,
		hoverInteractionType: null,

		setInteraction: (interaction) => {
			const current = get().interaction;

			if (
				current.type === interaction.type &&
				current.allowMiddlePan === interaction.allowMiddlePan &&
				current.allowEdgeScroll === interaction.allowEdgeScroll &&
				current.edgeScrollOverride === interaction.edgeScrollOverride
			)
				return;

			set({ interaction });
		},

		setHoverInteractionType: (hoverInteractionType) => {
			if (get().hoverInteractionType === hoverInteractionType) return;

			set({ hoverInteractionType });
		},

		setEdgeScrollOverride: (override) => {
			const current = get().interaction;

			if (current.edgeScrollOverride === override) return;

			set({
				interaction: {
					...current,
					edgeScrollOverride: override,
				},
			});
		},

		clearInteraction: () => {
			const current = get().interaction;

			if (
				current.type === DEFAULT_INTERACTION.type &&
				current.allowMiddlePan === DEFAULT_INTERACTION.allowMiddlePan &&
				current.allowEdgeScroll === DEFAULT_INTERACTION.allowEdgeScroll &&
				current.edgeScrollOverride === DEFAULT_INTERACTION.edgeScrollOverride
			)
				return;

			set({ interaction: DEFAULT_INTERACTION });
		},
	}));
}

export function VttInteractionContextProvider({
	children,
}: VttInteractionContextProviderProps) {
	const activeSceneId = useVttContext((state) => state.activeSceneId);
	const [store] = useState(createVttInteractionStore);

	useEffect(() => {
		store.getState().clearInteraction();
	}, [activeSceneId, store]);

	return (
		<VttInteractionContext.Provider value={store}>
			{children}
		</VttInteractionContext.Provider>
	);
}

export function useVttInteractionContext<T>(
	selector: (state: VttInteractionContextState) => T,
): T {
	const store = useContext(VttInteractionContext);

	if (!store)
		throw new Error(
			"useVttInteractionContext must be used inside a VttInteractionContextProvider.",
		);

	return useStore(store, selector);
}
