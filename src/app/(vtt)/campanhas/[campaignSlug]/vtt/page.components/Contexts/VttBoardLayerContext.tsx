"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { createStore, StoreApi, useStore } from "zustand";

export enum VttBoardLayer {
	None = -1,
	GridMap = 0,
	Image = 200,
	Token = 300,
	Drawing = 400,
}

export interface VttBoardLayerState {
	activeLayer: VttBoardLayer;
	setActiveLayer: (layer: VttBoardLayer) => void;
	isLayerActive: (layer: VttBoardLayer) => boolean;
	isLayerAbove: (layer: VttBoardLayer, reference: VttBoardLayer) => boolean;
	isLayerBelow: (layer: VttBoardLayer, reference: VttBoardLayer) => boolean;
	isLayerBetween: (
		layer: VttBoardLayer,
		lower: VttBoardLayer,
		upper: VttBoardLayer,
	) => boolean;

	getLayerOrder: (layer: VttBoardLayer) => number;
}

const STORAGE_KEY = "Vtt-Active-Layer";

const VttBoardLayerStoreContext =
	createContext<StoreApi<VttBoardLayerState> | null>(null);

interface VttBoardLayerContextProviderProps {
	children: ReactNode;
}

function isVttBoardLayer(value: number): value is VttBoardLayer {
	return Object.values(VttBoardLayer)
		.filter((item): item is number => typeof item === "number")
		.includes(value);
}

function createVttBoardLayerStore(): StoreApi<VttBoardLayerState> {
	return createStore<VttBoardLayerState>()((set, get) => ({
		activeLayer: VttBoardLayer.Token,
		setActiveLayer: (activeLayer) => {
			if (!isVttBoardLayer(activeLayer)) return;
			set({ activeLayer });
		},
		isLayerActive: (layer) => get().activeLayer === layer,
		isLayerAbove: (layer, reference) => layer > reference,
		isLayerBelow: (layer, reference) => layer < reference,
		isLayerBetween: (layer, lower, upper) => layer > lower && layer < upper,
		getLayerOrder: (layer) => layer,
	}));
}

export function VttBoardLayerContextProvider({
	children,
}: VttBoardLayerContextProviderProps) {
	const [store] = useState(() => createVttBoardLayerStore());

	useEffect(() => {
		const storageActiveLayer = localStorage.getItem(STORAGE_KEY);
		if (storageActiveLayer === null) return;
		const layer = Number(storageActiveLayer);
		if (isVttBoardLayer(layer)) store.getState().setActiveLayer(layer);
	}, [store]);

	useEffect(() => {
		return store.subscribe((state, previousState) => {
			if (state.activeLayer === previousState.activeLayer) return;
			localStorage.setItem(STORAGE_KEY, `${state.activeLayer}`);
		});
	}, [store]);

	return (
		<VttBoardLayerStoreContext.Provider value={store}>
			{children}
		</VttBoardLayerStoreContext.Provider>
	);
}

export function useVttBoardLayerStoreApi(): StoreApi<VttBoardLayerState> {
	const store = useContext(VttBoardLayerStoreContext);
	if (!store)
		throw new Error(
			"useVttBoardLayerStoreApi must be used inside a VttBoardLayerContextProvider.",
		);
	return store;
}

export function useVttBoardLayerStore<T>(
	selector: (state: VttBoardLayerState) => T,
): T {
	return useStore(useVttBoardLayerStoreApi(), selector);
}

/**
 * Compatibility hook. Prefer passing a selector for granular subscriptions.
 */
export function useVttBoardLayerContext(): VttBoardLayerState;

export function useVttBoardLayerContext<T>(
	selector: (state: VttBoardLayerState) => T,
): T;

export function useVttBoardLayerContext<T>(
	selector?: (state: VttBoardLayerState) => T,
): T | VttBoardLayerState {
	const store = useVttBoardLayerStoreApi();
	const resolvedSelector: (
		state: VttBoardLayerState,
	) => T | VttBoardLayerState = selector ?? ((state) => state);
	return useStore(store, resolvedSelector);
}
