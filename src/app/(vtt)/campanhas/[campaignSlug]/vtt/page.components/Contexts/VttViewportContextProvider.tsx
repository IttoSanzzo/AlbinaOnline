"use client";

import { Guid } from "@/libs/stp@types";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useVttContext } from "./VttContextProvider";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const DEFAULT_ZOOM = 1;
const GRID_CELL_SIZE = 100;
export const PIXELS_PER_CENTIMETER = 1;

interface VttPosition {
	x: number;
	y: number;
}

interface VttViewportSize {
	width: number;
	height: number;
}

interface VttVisibleWorld {
	left: number;
	top: number;
	right: number;
	bottom: number;
	width: number;
	height: number;
}

type VisibilityMode = "center" | "partial" | "full";

interface VttBounds {
	x: number;
	y: number;
	width?: number;
	height?: number;
}

interface VttCamera {
	x: number;
	y: number;
	zoom: number;
}

interface VttViewportContext {
	vttId: Guid | null;
	sceneId: Guid | null;
	viewport: VttViewportSize;
	camera: VttCamera;
	pixelsPerCentimeter: number;
	gridCellSize: number;
	visibleWorld: VttVisibleWorld;
	isVisible: (
		bounds: VttBounds,
		mode?: VisibilityMode,
		padding?: number,
	) => boolean;
	worldToScreen: (position: VttPosition) => VttPosition;
	screenToWorld: (position: VttPosition) => VttPosition;
	setCameraPosition: (x: number, y: number) => void;
	moveCamera: (deltaX: number, deltaY: number) => void;
	setZoom: (zoom: number) => void;
	zoomAt: (screenPosition: VttPosition, zoom: number) => void;
	resetCamera: () => void;
	resetPosition: () => void;
	resetZoom: () => void;
}

const VttViewportContext = createContext<VttViewportContext | null>(null);

interface VttViewportContextProviderProps {
	children: ReactNode;
}
export function VttViewportContextProvider({
	children,
}: VttViewportContextProviderProps) {
	const { vttId, activeSceneId } = useVttContext();
	const [viewport, setViewport] = useState<VttViewportSize>({
		width: typeof window === "undefined" ? 0 : window.innerWidth,
		height: typeof window === "undefined" ? 0 : window.innerHeight,
	});
	const [isCameraLoaded, setIsCameraLoaded] = useState(false);

	const [camera, setCamera] = useState<VttCamera>({
		x: 0,
		y: 0,
		zoom: DEFAULT_ZOOM,
	});

	useEffect(() => {
		const handleResize = () => {
			setViewport({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const storageKey = useMemo(() => {
		if (!vttId) return null;
		return `vttId=${vttId}|scene=${activeSceneId}|camera`;
	}, [vttId, activeSceneId]);

	useEffect(() => {
		if (!storageKey) return;

		setIsCameraLoaded(false);
		const stored = localStorage.getItem(storageKey);
		if (!stored) {
			setIsCameraLoaded(true);
			return;
		}
		try {
			const storedCamera = JSON.parse(stored) as VttCamera;
			setCamera({
				x: storedCamera.x ?? 0,
				y: storedCamera.y ?? 0,
				zoom: Math.min(
					MAX_ZOOM,
					Math.max(MIN_ZOOM, storedCamera.zoom ?? DEFAULT_ZOOM),
				),
			});
		} catch {
			localStorage.removeItem(storageKey);
		}
		setIsCameraLoaded(true);
	}, [storageKey, setIsCameraLoaded]);

	useEffect(() => {
		if (!storageKey || !isCameraLoaded) return;
		localStorage.setItem(storageKey, JSON.stringify(camera));
	}, [storageKey, camera, isCameraLoaded]);

	const setCameraPosition = (x: number, y: number) => {
		setCamera((current) => ({
			...current,
			x,
			y,
		}));
	};

	const moveCamera = useCallback(
		(deltaX: number, deltaY: number) => {
			setCamera((current) => ({
				...current,
				x: current.x + deltaX,
				y: current.y + deltaY,
			}));
		},
		[setCamera],
	);

	const setZoom = (zoom: number) => {
		setCamera((current) => ({
			...current,
			zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)),
		}));
	};

	const zoomAt = (screenPosition: VttPosition, zoom: number) => {
		const nextZoom = Math.round(zoom * 10) / 10;
		if (nextZoom < MIN_ZOOM || nextZoom > MAX_ZOOM) return;

		setCamera((current) => {
			const worldPosition = {
				x: Math.round(
					current.x +
						(screenPosition.x - viewport.width / 2) /
							(PIXELS_PER_CENTIMETER * current.zoom),
				),
				y: Math.round(
					current.y +
						(screenPosition.y - viewport.height / 2) /
							(PIXELS_PER_CENTIMETER * current.zoom),
				),
			};

			return {
				x: Math.round(
					worldPosition.x -
						(screenPosition.x - viewport.width / 2) /
							(PIXELS_PER_CENTIMETER * nextZoom),
				),
				y: Math.round(
					worldPosition.y -
						(screenPosition.y - viewport.height / 2) /
							(PIXELS_PER_CENTIMETER * nextZoom),
				),
				zoom: nextZoom,
			};
		});
	};

	const resetCamera = () => {
		setCamera({
			x: 0,
			y: 0,
			zoom: DEFAULT_ZOOM,
		});
	};
	const resetZoom = () => {
		setCamera({
			x: camera.x,
			y: camera.y,
			zoom: DEFAULT_ZOOM,
		});
	};
	const resetPosition = () => {
		setCamera({
			x: 0,
			y: 0,
			zoom: camera.zoom,
		});
	};

	const worldToScreen = (position: VttPosition): VttPosition => {
		return {
			x:
				(position.x - camera.x) * PIXELS_PER_CENTIMETER * camera.zoom +
				viewport.width / 2,
			y:
				(position.y - camera.y) * PIXELS_PER_CENTIMETER * camera.zoom +
				viewport.height / 2,
		};
	};

	const screenToWorld = (position: VttPosition): VttPosition => {
		return {
			x:
				(position.x - viewport.width / 2) /
					(PIXELS_PER_CENTIMETER * camera.zoom) +
				camera.x,
			y:
				(position.y - viewport.height / 2) /
					(PIXELS_PER_CENTIMETER * camera.zoom) +
				camera.y,
		};
	};

	const visibleWorld = useMemo<VttVisibleWorld>(() => {
		const topLeft = screenToWorld({
			x: 0,
			y: 0,
		});

		const bottomRight = screenToWorld({
			x: viewport.width,
			y: viewport.height,
		});

		return {
			left: topLeft.x,
			top: topLeft.y,
			right: bottomRight.x,
			bottom: bottomRight.y,
			width: bottomRight.x - topLeft.x,
			height: bottomRight.y - topLeft.y,
		};
	}, [camera, viewport]);

	const isVisible = (
		bounds: VttBounds,
		mode: VisibilityMode = "partial",
		padding = 0,
	): boolean => {
		const left = visibleWorld.left + padding;
		const right = visibleWorld.right - padding;
		const top = visibleWorld.top + padding;
		const bottom = visibleWorld.bottom - padding;

		if (mode === "center") {
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

		switch (mode) {
			case "partial":
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
	};

	const contextValue = useMemo<VttViewportContext>(
		() => ({
			vttId,
			sceneId: activeSceneId,
			viewport,
			camera,
			pixelsPerCentimeter: PIXELS_PER_CENTIMETER,
			gridCellSize: GRID_CELL_SIZE,
			visibleWorld,
			isVisible,
			worldToScreen,
			screenToWorld,
			setCameraPosition,
			moveCamera,
			setZoom,
			zoomAt,
			resetCamera,
			resetZoom,
			resetPosition,
		}),
		[vttId, activeSceneId, viewport, camera, visibleWorld],
	);

	return (
		<VttViewportContext.Provider value={contextValue}>
			{children}
		</VttViewportContext.Provider>
	);
}

export function useVttViewportContext(): VttViewportContext {
	const context = useContext(VttViewportContext);

	if (!context)
		throw new Error(
			"useVttViewportContext must be used inside a VttViewportContextProvider.",
		);

	return context;
}
