"use client";

import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { useVttContext } from "./VttContextProvider";

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 5;
const DEFAULT_ZOOM = 1;
const GRID_CELL_SIZE = 100;
export const PIXELS_PER_CENTIMETER = 1;

export interface VttViewportSize {
	width: number;
	height: number;
}

export interface VttVisibleWorld {
	left: number;
	top: number;
	right: number;
	bottom: number;
	width: number;
	height: number;
}

export type VisibilityMode = "center" | "partial" | "full" | "partial-extra";

export interface VttBounds {
	x: number;
	y: number;
	width?: number;
	height?: number;
}

export interface VttCamera {
	x: number;
	y: number;
	zoom: number;
}

export function isVisible(
	bounds: VttBounds,
	visibleWorld: VttVisibleWorld,
	mode?: VisibilityMode,
	padding?: number,
): boolean {
	const visibilityMode = mode ?? "partial";
	const visibilityPadding = padding ?? 0;
	const expansion = visibilityMode === "partial-extra" ? visibilityPadding : 0;
	const inset = visibilityMode === "partial-extra" ? 0 : visibilityPadding;

	const left = visibleWorld.left + inset - expansion;
	const right = visibleWorld.right - inset + expansion;
	const top = visibleWorld.top + inset - expansion;
	const bottom = visibleWorld.bottom - inset + expansion;

	if (visibilityMode === "center") {
		return (
			bounds.x >= left &&
			bounds.x <= right &&
			bounds.y >= top &&
			bounds.y <= bottom
		);
	}

	const halfWidth = (bounds.width ?? 0) / 2;
	const halfHeight = (bounds.height ?? 0) / 2;
	const boundsLeft = bounds.x - halfWidth;
	const boundsRight = bounds.x + halfWidth;
	const boundsTop = bounds.y - halfHeight;
	const boundsBottom = bounds.y + halfHeight;

	switch (visibilityMode) {
		case "partial":
		case "partial-extra":
			return (
				boundsRight >= left &&
				boundsLeft <= right &&
				boundsBottom >= top &&
				boundsTop <= bottom
			);

		case "full":
			return (
				boundsLeft >= left &&
				boundsRight <= right &&
				boundsTop >= top &&
				boundsBottom <= bottom
			);
	}
}

export interface VttViewportState {
	vttId: Guid | null;
	sceneId: Guid | null;
	viewport: VttViewportSize;
	camera: VttCamera;
	pixelsPerCentimeter: number;
	gridCellSize: number;
	cullingMargin: number;
	visibleWorld: VttVisibleWorld;
	isVisible: (
		bounds: VttBounds,
		mode?: VisibilityMode,
		padding?: number,
	) => boolean;
	worldToScreen: (position: CoordinatePair) => CoordinatePair;
	screenToWorld: (position: CoordinatePair) => CoordinatePair;
	setCameraPosition: (x: number, y: number) => void;
	moveCamera: (deltaX: number, deltaY: number) => void;
	setZoom: (zoom: number) => void;
	zoomAt: (screenPosition: CoordinatePair, zoom: number) => void;
	resetCamera: () => void;
	resetPosition: () => void;
	resetZoom: () => void;
}

const VttViewportStoreContext =
	createContext<StoreApi<VttViewportState> | null>(null);

interface VttViewportContextProviderProps {
	children: ReactNode;
}

function clampZoom(zoom: number): number {
	return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

function getVisibleWorld(
	camera: VttCamera,
	viewport: VttViewportSize,
): VttVisibleWorld {
	const scale = PIXELS_PER_CENTIMETER * camera.zoom;
	const left = camera.x - viewport.width / 2 / scale;
	const top = camera.y - viewport.height / 2 / scale;
	const right = camera.x + viewport.width / 2 / scale;
	const bottom = camera.y + viewport.height / 2 / scale;

	return {
		left,
		top,
		right,
		bottom,
		width: right - left,
		height: bottom - top,
	};
}

function createVttViewportStore(
	vttId: Guid | null,
	sceneId: Guid | null,
): StoreApi<VttViewportState> {
	const initialCamera: VttCamera = {
		x: 0,
		y: 0,
		zoom: DEFAULT_ZOOM,
	};
	const initialViewport: VttViewportSize = {
		width: 0,
		height: 0,
	};

	return createStore<VttViewportState>()((set, get) => {
		const updateCamera = (camera: VttCamera) => {
			set({
				camera,
				visibleWorld: getVisibleWorld(camera, get().viewport),
			});
		};

		return {
			vttId,
			sceneId,
			viewport: initialViewport,
			camera: initialCamera,
			pixelsPerCentimeter: PIXELS_PER_CENTIMETER,
			gridCellSize: GRID_CELL_SIZE,
			cullingMargin: 0,
			visibleWorld: getVisibleWorld(initialCamera, initialViewport),

			isVisible: (bounds, mode, padding) => {
				const state = get();
				const visibilityPadding =
					mode === "partial-extra"
						? (padding ??
							state.cullingMargin / (PIXELS_PER_CENTIMETER * state.camera.zoom))
						: padding;

				return isVisible(bounds, state.visibleWorld, mode, visibilityPadding);
			},

			worldToScreen: (position) => {
				const { camera, viewport } = get();
				const scale = PIXELS_PER_CENTIMETER * camera.zoom;

				return {
					x: (position.x - camera.x) * scale + viewport.width / 2,
					y: (position.y - camera.y) * scale + viewport.height / 2,
				};
			},

			screenToWorld: (position) => {
				const { camera, viewport } = get();
				const scale = PIXELS_PER_CENTIMETER * camera.zoom;

				return {
					x: (position.x - viewport.width / 2) / scale + camera.x,
					y: (position.y - viewport.height / 2) / scale + camera.y,
				};
			},

			setCameraPosition: (x, y) => {
				updateCamera({ ...get().camera, x, y });
			},

			moveCamera: (deltaX, deltaY) => {
				const { camera } = get();

				updateCamera({
					...camera,
					x: camera.x + deltaX,
					y: camera.y + deltaY,
				});
			},

			setZoom: (zoom) => {
				updateCamera({ ...get().camera, zoom: clampZoom(zoom) });
			},

			zoomAt: (screenPosition, zoom) => {
				const { camera, viewport } = get();
				const nextZoom = clampZoom(zoom);
				const scale = PIXELS_PER_CENTIMETER;

				const worldPosition = {
					x: Math.round(
						camera.x +
							(screenPosition.x - viewport.width / 2) / (scale * camera.zoom),
					),
					y: Math.round(
						camera.y +
							(screenPosition.y - viewport.height / 2) / (scale * camera.zoom),
					),
				};

				updateCamera({
					x: Math.round(
						worldPosition.x -
							(screenPosition.x - viewport.width / 2) / (scale * nextZoom),
					),
					y: Math.round(
						worldPosition.y -
							(screenPosition.y - viewport.height / 2) / (scale * nextZoom),
					),
					zoom: nextZoom,
				});
			},

			resetCamera: () => updateCamera(initialCamera),

			resetPosition: () => {
				updateCamera({ ...get().camera, x: 0, y: 0 });
			},

			resetZoom: () => {
				updateCamera({ ...get().camera, zoom: DEFAULT_ZOOM });
			},
		};
	});
}

export function VttViewportContextProvider({
	children,
}: VttViewportContextProviderProps) {
	const vttId = useVttContext((state) => state.vttId);
	const activeSceneId = useVttContext((state) => state.activeSceneId);
	const [store] = useState(() => createVttViewportStore(vttId, activeSceneId));
	const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);

	const storageKey = useMemo(
		() => (vttId ? `vttId=${vttId}|scene=${activeSceneId}|camera` : null),
		[vttId, activeSceneId],
	);

	useEffect(() => {
		store.setState({ vttId, sceneId: activeSceneId });
	}, [store, vttId, activeSceneId]);

	useEffect(() => {
		const handleResize = () => {
			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			store.setState((state) => ({
				viewport,
				cullingMargin: Math.max(viewport.width, viewport.height) * 0.5,
				visibleWorld: getVisibleWorld(state.camera, viewport),
			}));
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [store]);

	useEffect(() => {
		if (!storageKey) {
			setLoadedStorageKey(null);
			return;
		}

		let camera: VttCamera = {
			x: 0,
			y: 0,
			zoom: DEFAULT_ZOOM,
		};

		try {
			const stored = localStorage.getItem(storageKey);

			if (stored) {
				const parsed = JSON.parse(stored) as Partial<VttCamera>;

				camera = {
					x: parsed.x ?? 0,
					y: parsed.y ?? 0,
					zoom: clampZoom(parsed.zoom ?? DEFAULT_ZOOM),
				};
			}
		} catch {
			try {
				localStorage.removeItem(storageKey);
			} catch {
				// Storage may be unavailable in the current browser context.
			}
		}

		store.setState((state) => ({
			camera,
			visibleWorld: getVisibleWorld(camera, state.viewport),
		}));
		setLoadedStorageKey(storageKey);
	}, [store, storageKey]);

	useEffect(() => {
		if (!storageKey || loadedStorageKey !== storageKey) return;

		const unsubscribe = store.subscribe((state, previousState) => {
			if (state.camera === previousState.camera) return;

			try {
				localStorage.setItem(storageKey, JSON.stringify(state.camera));
			} catch {
				// Storage may be unavailable or full.
			}
		});

		try {
			localStorage.setItem(storageKey, JSON.stringify(store.getState().camera));
		} catch {
			// Storage may be unavailable or full.
		}

		return unsubscribe;
	}, [store, storageKey, loadedStorageKey]);

	return (
		<VttViewportStoreContext.Provider value={store}>
			{children}
		</VttViewportStoreContext.Provider>
	);
}

export function useVttViewportStoreApi(): StoreApi<VttViewportState> {
	const store = useContext(VttViewportStoreContext);

	if (!store)
		throw new Error(
			"useVttViewportStoreApi must be used inside a VttViewportContextProvider.",
		);

	return store;
}

export function useVttViewportStore<T>(
	selector: (state: VttViewportState) => T,
): T {
	return useStore(useVttViewportStoreApi(), selector);
}
