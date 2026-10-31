"use client";

import {
	PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useVttThrottledViewportContext } from "../Contexts/VttThrottledViewportContext";
import { useVttInteractionContext } from "../Contexts/VttInteractionContextProvider";
import { VttCursorInteractionType } from "../Types/Classes/VttMouseState";
import { VttResourceLockDto } from "../Types/Classes/VttResourceLock";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { useCurrentCampaignMemberStore } from "@/libs/stp@hooks";

const DRAG_THRESHOLD = 5;
const LONG_PRESS_DURATION = 500;
const DRAG_UPDATE_INTERVAL = 1000 / 10;
const REMOTE_INTERPOLATION_DURATION = 100;

export type VttResourceDragSnapOptions =
	| { type: "vertex"; cellSize?: number }
	| { type: "center"; cellSize?: number }
	| {
			type: "centered";
			cellSize?: number;
			width: number;
			height: number;
			offsetX?: number;
			offsetY?: number;
	  };

export type VttResourceDragSnapFunction = (
	coordinates: CoordinatePair,
) => CoordinatePair;

export type VttResourceDragSnap =
	| number
	| VttResourceDragSnapOptions
	| VttResourceDragSnapFunction;

export interface UseVttResourceDragOptions {
	coordinates: CoordinatePair;
	resourceLock?: VttResourceLockDto;
	enabled?: boolean;
	snap?: VttResourceDragSnap;
	onDragStart?: () => void;
	onDragUpdate?: (coordinates: CoordinatePair) => void;
	onDragEnd?: (coordinates: CoordinatePair) => void;
	onDragCancel?: () => void;
	onLongPress?: () => void;
}

export interface UseVttResourceDragResult {
	coordinates: CoordinatePair;
	isDragging: boolean;
	isLocalDragging: boolean;
	isRemoteDragging: boolean;
	onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
	onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
	onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
	snapCoordinates: (
		coordinates: CoordinatePair,
		snap?: VttResourceDragSnap,
	) => CoordinatePair;
	cancel: () => void;
	clearLongPress: () => void;
}

function snapCoordinateToVertex(coordinate: number, cellSize: number) {
	return Math.round(coordinate / cellSize) * cellSize;
}

function snapCoordinateToCenter(coordinate: number, cellSize: number) {
	return (Math.round(coordinate / cellSize - 0.5) + 0.5) * cellSize;
}

function snapCoordinateToCenteredArea(
	coordinate: number,
	size: number,
	offset: number,
	cellSize: number,
) {
	return (
		Math.round((coordinate - size / 2 + offset) / cellSize) * cellSize +
		size / 2 -
		offset
	);
}

function applySnap(
	coordinates: CoordinatePair,
	snap: VttResourceDragSnap,
): CoordinatePair {
	if (typeof snap === "function") return snap(coordinates);

	if (typeof snap === "number") {
		if (!Number.isFinite(snap) || snap <= 0) return coordinates;
		return {
			x: snapCoordinateToVertex(coordinates.x, snap),
			y: snapCoordinateToVertex(coordinates.y, snap),
		};
	}

	const cellSize = snap.cellSize ?? 100;
	if (!Number.isFinite(cellSize) || cellSize <= 0) return coordinates;

	switch (snap.type) {
		case "vertex":
			return {
				x: snapCoordinateToVertex(coordinates.x, cellSize),
				y: snapCoordinateToVertex(coordinates.y, cellSize),
			};
		case "center":
			return {
				x: snapCoordinateToCenter(coordinates.x, cellSize),
				y: snapCoordinateToCenter(coordinates.y, cellSize),
			};
		case "centered":
			if (
				!Number.isFinite(snap.width) ||
				!Number.isFinite(snap.height) ||
				snap.width <= 0 ||
				snap.height <= 0
			)
				return coordinates;

			return {
				x: snapCoordinateToCenteredArea(
					coordinates.x,
					snap.width,
					snap.offsetX ?? 0,
					cellSize,
				),
				y: snapCoordinateToCenteredArea(
					coordinates.y,
					snap.height,
					snap.offsetY ?? 0,
					cellSize,
				),
			};
	}
}

export function useVttResourceDrag({
	coordinates: sourceCoordinates,
	resourceLock,
	enabled = true,
	snap = 0,
	onDragStart,
	onDragUpdate,
	onDragEnd,
	onDragCancel,
	onLongPress,
}: UseVttResourceDragOptions): UseVttResourceDragResult {
	const screenToWorld = useVttThrottledViewportContext(
		(state) => state.screenToWorld,
		16,
	);
	const setHoverInteractionType = useVttInteractionContext(
		(state) => state.setHoverInteractionType,
	);
	const setEdgeScrollOverride = useVttInteractionContext(
		(state) => state.setEdgeScrollOverride,
	);
	const userId = useCurrentCampaignMemberStore((state) => state.member?.userId);

	const [dragCoordinates, setDragCoordinates] = useState(sourceCoordinates);
	const [visualCoordinates, setVisualCoordinates] = useState(sourceCoordinates);
	const [isPointerDragging, setIsPointerDragging] = useState(false);

	const sourceCoordinatesRef = useRef(sourceCoordinates);
	const enabledRef = useRef(enabled);
	const snapRef = useRef(snap);
	const resourceLockRef = useRef(resourceLock);
	const userIdRef = useRef(userId);
	const onDragStartRef = useRef(onDragStart);
	const onDragUpdateRef = useRef(onDragUpdate);
	const onDragEndRef = useRef(onDragEnd);
	const onDragCancelRef = useRef(onDragCancel);
	const onLongPressRef = useRef(onLongPress);

	sourceCoordinatesRef.current = sourceCoordinates;
	enabledRef.current = enabled;
	snapRef.current = snap;
	resourceLockRef.current = resourceLock;
	userIdRef.current = userId;
	onDragStartRef.current = onDragStart;
	onDragUpdateRef.current = onDragUpdate;
	onDragEndRef.current = onDragEnd;
	onDragCancelRef.current = onDragCancel;
	onLongPressRef.current = onLongPress;

	const pointerIdRef = useRef<number | null>(null);
	const pointerStartRef = useRef({ x: 0, y: 0 });
	const dragStartCoordinatesRef = useRef(sourceCoordinates);
	const dragStartedRef = useRef(false);
	const longPressTriggeredRef = useRef(false);
	const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const lastDragUpdateRef = useRef(0);
	const dragMousePositionRef = useRef({ x: 0, y: 0 });
	const dragOffsetRef = useRef({ x: 0, y: 0 });
	const dragAnimationFrameRef = useRef<number | null>(null);
	const screenToWorldRef = useRef(screenToWorld);
	const previousDocumentUserSelectRef = useRef<string | null>(null);
	const previousBodyUserSelectRef = useRef<string | null>(null);
	const remoteAnimationFrameRef = useRef<number | null>(null);
	const remoteAnimationStartRef = useRef(0);
	const remoteAnimationFromRef = useRef(sourceCoordinates);
	const remoteAnimationToRef = useRef(sourceCoordinates);
	const visualCoordinatesRef = useRef(sourceCoordinates);
	const remoteDragInitializedRef = useRef(false);

	screenToWorldRef.current = screenToWorld;

	const hasDragLock = resourceLock?.lockType === "drag";
	const isLocalDragging =
		hasDragLock && userId != null && resourceLock.userId === userId;
	const isRemoteDragging =
		hasDragLock && userId != null && resourceLock.userId !== userId;

	const isDragging = isPointerDragging || isLocalDragging || isRemoteDragging;

	const snapCoordinates = useCallback(
		(
			coordinates: CoordinatePair,
			snapOverride?: VttResourceDragSnap,
		): CoordinatePair =>
			applySnap(coordinates, snapOverride ?? snapRef.current),
		[],
	);

	const clearLongPress = useCallback(() => {
		if (longPressTimeoutRef.current === null) return;
		clearTimeout(longPressTimeoutRef.current);
		longPressTimeoutRef.current = null;
	}, []);

	function setDragMousePosition(clientX: number, clientY: number) {
		dragMousePositionRef.current = { x: clientX, y: clientY };
	}

	function getDragCoordinates(clientX: number, clientY: number) {
		const worldPosition = screenToWorldRef.current({
			x: clientX,
			y: clientY,
		});
		return {
			x: Math.round(worldPosition.x + dragOffsetRef.current.x),
			y: Math.round(worldPosition.y + dragOffsetRef.current.y),
		};
	}

	function preventNativeSelection(event: Event) {
		if (!dragStartedRef.current) return;
		event.preventDefault();
		window.getSelection()?.removeAllRanges();
	}

	function preventNativeDrag(event: DragEvent) {
		if (!dragStartedRef.current) return;
		event.preventDefault();
	}

	function preventSelection() {
		if (previousDocumentUserSelectRef.current !== null) return;

		previousDocumentUserSelectRef.current =
			document.documentElement.style.userSelect;
		previousBodyUserSelectRef.current = document.body.style.userSelect;
		document.documentElement.style.userSelect = "none";
		document.body.style.userSelect = "none";
		window.addEventListener("selectstart", preventNativeSelection);
		window.addEventListener("dragstart", preventNativeDrag);
		window.getSelection()?.removeAllRanges();
	}

	function restoreUserSelect() {
		if (previousDocumentUserSelectRef.current === null) return;

		document.documentElement.style.userSelect =
			previousDocumentUserSelectRef.current;
		document.body.style.userSelect = previousBodyUserSelectRef.current ?? "";
		window.removeEventListener("selectstart", preventNativeSelection);
		window.removeEventListener("dragstart", preventNativeDrag);
		previousDocumentUserSelectRef.current = null;
		previousBodyUserSelectRef.current = null;
		window.getSelection()?.removeAllRanges();
	}

	function updateDrag(clientX: number, clientY: number, force = false) {
		const nextCoordinates = getDragCoordinates(clientX, clientY);
		setDragCoordinates(nextCoordinates);

		const now = performance.now();
		if (!force && now - lastDragUpdateRef.current < DRAG_UPDATE_INTERVAL)
			return;

		lastDragUpdateRef.current = now;
		onDragUpdateRef.current?.(nextCoordinates);
	}

	function updateDragFromCurrentPointer() {
		if (!dragStartedRef.current) return;

		updateDrag(dragMousePositionRef.current.x, dragMousePositionRef.current.y);
		dragAnimationFrameRef.current = requestAnimationFrame(
			updateDragFromCurrentPointer,
		);
	}

	function removeWindowDragListeners() {
		window.removeEventListener("pointermove", handleWindowPointerMove);
		window.removeEventListener("pointerup", handleWindowPointerUp);
		window.removeEventListener("pointercancel", handleWindowPointerCancel);
	}

	function finishPointer() {
		clearLongPress();
		removeWindowDragListeners();

		if (dragAnimationFrameRef.current !== null) {
			cancelAnimationFrame(dragAnimationFrameRef.current);
			dragAnimationFrameRef.current = null;
		}

		pointerIdRef.current = null;
		dragStartedRef.current = false;
		setIsPointerDragging(false);
		longPressTriggeredRef.current = false;
		setHoverInteractionType(null);
		setEdgeScrollOverride(null);
		restoreUserSelect();
	}

	function startDrag() {
		clearLongPress();
		dragStartedRef.current = true;
		setIsPointerDragging(true);
		setHoverInteractionType(VttCursorInteractionType.Hand);
		setEdgeScrollOverride(true);

		dragStartCoordinatesRef.current = {
			...sourceCoordinatesRef.current,
		};

		const cursorWorldPosition = screenToWorldRef.current({
			x: pointerStartRef.current.x,
			y: pointerStartRef.current.y,
		});

		dragOffsetRef.current = {
			x: sourceCoordinatesRef.current.x - cursorWorldPosition.x,
			y: sourceCoordinatesRef.current.y - cursorWorldPosition.y,
		};

		lastDragUpdateRef.current = performance.now();
		preventSelection();
		onDragStartRef.current?.();
		setDragCoordinates(dragStartCoordinatesRef.current);

		dragAnimationFrameRef.current = requestAnimationFrame(
			updateDragFromCurrentPointer,
		);

		window.addEventListener("pointermove", handleWindowPointerMove);
		window.addEventListener("pointerup", handleWindowPointerUp);
		window.addEventListener("pointercancel", handleWindowPointerCancel);
	}

	function endDrag(clientX: number, clientY: number) {
		const finalCoordinates = applySnap(
			getDragCoordinates(clientX, clientY),
			snapRef.current,
		);

		setDragCoordinates(finalCoordinates);
		visualCoordinatesRef.current = finalCoordinates;
		setVisualCoordinates(finalCoordinates);
		onDragEndRef.current?.(finalCoordinates);
	}

	function handleWindowPointerMove(event: PointerEvent) {
		if (!dragStartedRef.current || event.pointerId !== pointerIdRef.current)
			return;

		event.preventDefault();
		setDragMousePosition(event.clientX, event.clientY);
	}

	function handleWindowPointerUp(event: PointerEvent) {
		if (!dragStartedRef.current || event.pointerId !== pointerIdRef.current)
			return;

		endDrag(event.clientX, event.clientY);
		finishPointer();
	}

	function handleWindowPointerCancel(event: PointerEvent) {
		if (event.pointerId !== pointerIdRef.current) return;
		cancel();
	}

	const cancel = useCallback(() => {
		const wasDragging = dragStartedRef.current;
		finishPointer();
		if (wasDragging) onDragCancelRef.current?.();
	}, []);

	useEffect(() => {
		if (!dragStartedRef.current) {
			setDragCoordinates(sourceCoordinates);
		}
	}, [sourceCoordinates]);

	useEffect(() => {
		if (!isRemoteDragging) {
			if (remoteAnimationFrameRef.current !== null) {
				cancelAnimationFrame(remoteAnimationFrameRef.current);
				remoteAnimationFrameRef.current = null;
			}

			remoteDragInitializedRef.current = false;
			visualCoordinatesRef.current = sourceCoordinates;
			setVisualCoordinates(sourceCoordinates);
			return;
		}

		if (!remoteDragInitializedRef.current) {
			remoteDragInitializedRef.current = true;
			remoteAnimationFromRef.current = sourceCoordinates;
			remoteAnimationToRef.current = sourceCoordinates;
			visualCoordinatesRef.current = sourceCoordinates;
			setVisualCoordinates(sourceCoordinates);
			return;
		}

		remoteAnimationStartRef.current = performance.now();
		remoteAnimationFromRef.current = visualCoordinatesRef.current;
		remoteAnimationToRef.current = sourceCoordinates;

		if (remoteAnimationFrameRef.current !== null) return;

		const animate = () => {
			const elapsed = performance.now() - remoteAnimationStartRef.current;
			const progress = Math.min(elapsed / REMOTE_INTERPOLATION_DURATION, 1);
			const from = remoteAnimationFromRef.current;
			const to = remoteAnimationToRef.current;
			const nextCoordinates = {
				x: Math.round(from.x + (to.x - from.x) * progress),
				y: Math.round(from.y + (to.y - from.y) * progress),
			};

			visualCoordinatesRef.current = nextCoordinates;
			setVisualCoordinates(nextCoordinates);

			if (progress >= 1) {
				remoteAnimationFrameRef.current = null;
				return;
			}

			remoteAnimationFrameRef.current = requestAnimationFrame(animate);
		};

		remoteAnimationFrameRef.current = requestAnimationFrame(animate);
	}, [sourceCoordinates, isRemoteDragging]);

	useEffect(() => {
		if (!enabled && pointerIdRef.current !== null) cancel();
	}, [enabled, cancel]);

	useEffect(() => {
		return () => {
			clearLongPress();
			removeWindowDragListeners();

			if (dragAnimationFrameRef.current !== null)
				cancelAnimationFrame(dragAnimationFrameRef.current);
			if (remoteAnimationFrameRef.current !== null)
				cancelAnimationFrame(remoteAnimationFrameRef.current);

			restoreUserSelect();
		};
	}, []);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			const lock = resourceLockRef.current;
			const currentUserId = userIdRef.current;

			if (
				event.button !== 0 ||
				!enabledRef.current ||
				pointerIdRef.current !== null ||
				(lock != null &&
					(lock.lockType !== "drag" ||
						currentUserId == null ||
						lock.userId !== currentUserId))
			)
				return;

			pointerIdRef.current = event.pointerId;
			pointerStartRef.current = {
				x: event.clientX,
				y: event.clientY,
			};
			setDragMousePosition(event.clientX, event.clientY);
			dragStartCoordinatesRef.current = {
				...sourceCoordinatesRef.current,
			};
			dragStartedRef.current = false;
			longPressTriggeredRef.current = false;
			clearLongPress();

			longPressTimeoutRef.current = setTimeout(() => {
				if (pointerIdRef.current !== event.pointerId) return;
				if (dragStartedRef.current) return;

				longPressTriggeredRef.current = true;
				onLongPressRef.current?.();
				pointerIdRef.current = null;
				clearLongPress();
			}, LONG_PRESS_DURATION);
		},
		[clearLongPress],
	);

	const handlePointerMove = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (pointerIdRef.current !== event.pointerId) return;
			if (dragStartedRef.current || longPressTriggeredRef.current) return;

			const distance = Math.hypot(
				event.clientX - pointerStartRef.current.x,
				event.clientY - pointerStartRef.current.y,
			);
			if (distance < DRAG_THRESHOLD) return;

			event.preventDefault();
			setDragMousePosition(event.clientX, event.clientY);
			startDrag();
			updateDrag(event.clientX, event.clientY, true);
		},
		[],
	);

	const handlePointerUp = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (pointerIdRef.current !== event.pointerId) return;

			if (dragStartedRef.current) {
				endDrag(event.clientX, event.clientY);
				finishPointer();
				return;
			}

			finishPointer();
		},
		[],
	);

	const renderCoordinates =
		isPointerDragging || isLocalDragging ? dragCoordinates : visualCoordinates;

	return {
		coordinates: renderCoordinates,
		isDragging,
		isLocalDragging,
		isRemoteDragging,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		snapCoordinates,
		cancel,
		clearLongPress,
	};
}
