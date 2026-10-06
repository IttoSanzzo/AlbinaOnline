"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export enum VttBoardLayer {
	GridMap = 0,
	VirtualGrid = 100,
	Token = 200,
	Image = 300,
	Drawing = 400,
}

interface VttBoardLayerContext {
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

const VttBoardLayerContext = createContext<VttBoardLayerContext | null>(null);

interface VttBoardLayerContextProviderProps {
	children: ReactNode;
}
export function VttBoardLayerContextProvider({
	children,
}: VttBoardLayerContextProviderProps) {
	const [activeLayer, setActiveLayer] = useState<VttBoardLayer>(
		VttBoardLayer.GridMap,
		// VttBoardLayer.Token,
	);

	const isLayerActive = useCallback(
		(layer: VttBoardLayer) => {
			return activeLayer === layer;
		},
		[activeLayer],
	);

	const isLayerAbove = useCallback(
		(layer: VttBoardLayer, reference: VttBoardLayer) => {
			return layer > reference;
		},
		[],
	);

	const isLayerBelow = useCallback(
		(layer: VttBoardLayer, reference: VttBoardLayer) => {
			return layer < reference;
		},
		[],
	);

	const isLayerBetween = useCallback(
		(layer: VttBoardLayer, lower: VttBoardLayer, upper: VttBoardLayer) => {
			return layer > lower && layer < upper;
		},
		[],
	);

	const getLayerOrder = useCallback((layer: VttBoardLayer) => {
		return layer;
	}, []);

	const contextValue = useMemo<VttBoardLayerContext>(
		() => ({
			activeLayer,
			setActiveLayer,
			isLayerActive,
			isLayerAbove,
			isLayerBelow,
			isLayerBetween,
			getLayerOrder,
		}),
		[
			activeLayer,
			isLayerActive,
			isLayerAbove,
			isLayerBelow,
			isLayerBetween,
			getLayerOrder,
		],
	);

	return (
		<VttBoardLayerContext.Provider value={contextValue}>
			{children}
		</VttBoardLayerContext.Provider>
	);
}

export function useVttBoardLayerContext(): VttBoardLayerContext {
	const context = useContext(VttBoardLayerContext);

	if (!context)
		throw new Error(
			"useVttBoardLayerContext must be used inside a VttBoardLayerContextProvider.",
		);

	return context;
}
