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
import { useCurrentUser } from "@/libs/stp@hooks";

const DRAG_THRESHOLD = 5;
const LONG_PRESS_DURATION = 500;
const DRAG_UPDATE_INTERVAL = 1000 / 10;
const REMOTE_INTERPOLATION_DURATION = 100;

export interface UseVttResourceDragOptions {
	coordinates: CoordinatePair;
	resourceLock?: VttResourceLockDto;
	enabled?: boolean;
	snap?: number;
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
	cancel: () => void;
	clearLongPress: () => void;
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
	const { screenToWorld } = useVttThrottledViewportContext(16);
	const { setHoverInteractionType, setEdgeScrollOverride } =
		useVttInteractionContext();
	const { user } = useCurrentUser();

	const [dragCoordinates, setDragCoordinates] = useState(sourceCoordinates);
	const [visualCoordinates, setVisualCoordinates] = useState(sourceCoordinates);
	const [isDragging, setIsDragging] = useState(false);

	const sourceCoordinatesRef = useRef(sourceCoordinates);
	const enabledRef = useRef(enabled);
	const snapRef = useRef(snap);
	const onDragStartRef = useRef(onDragStart);
	const onDragUpdateRef = useRef(onDragUpdate);
	const onDragEndRef = useRef(onDragEnd);
	const onDragCancelRef = useRef(onDragCancel);
	const onLongPressRef = useRef(onLongPress);

	sourceCoordinatesRef.current = sourceCoordinates;
	enabledRef.current = enabled;
	snapRef.current = snap;
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

	const isLocalDragging =
		resourceLock?.lockType == "drag" && resourceLock.userId == user?.id;
	const isRemoteDragging =
		resourceLock?.lockType == "drag" && resourceLock.userId != user?.id;

	useEffect(() => {
		if (dragStartedRef.current) return;
		setDragCoordinates(sourceCoordinates);
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
			const coordinates = {
				x: Math.round(from.x + (to.x - from.x) * progress),
				y: Math.round(from.y + (to.y - from.y) * progress),
			};
			visualCoordinatesRef.current = coordinates;
			setVisualCoordinates(coordinates);
			if (progress >= 1) {
				remoteAnimationFrameRef.current = null;
				return;
			}
			remoteAnimationFrameRef.current = requestAnimationFrame(animate);
		};
		remoteAnimationFrameRef.current = requestAnimationFrame(animate);
	}, [sourceCoordinates, isRemoteDragging]);
	const clearLongPress = useCallback(() => {
		if (longPressTimeoutRef.current === null) return;
		clearTimeout(longPressTimeoutRef.current);
		longPressTimeoutRef.current = null;
	}, []);
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
	function setDragMousePosition(clientX: number, clientY: number) {
		dragMousePositionRef.current = {
			x: clientX,
			y: clientY,
		};
	}
	function updateDragFromCurrentMouse() {
		if (!dragStartedRef.current) return;
		updateDrag(dragMousePositionRef.current.x, dragMousePositionRef.current.y);
		dragAnimationFrameRef.current = requestAnimationFrame(
			updateDragFromCurrentMouse,
		);
	}
	function preventSelection() {
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
	function preventNativeSelection(event: Event) {
		if (!dragStartedRef.current) return;
		event.preventDefault();
		window.getSelection()?.removeAllRanges();
	}
	function preventNativeDrag(event: DragEvent) {
		if (!dragStartedRef.current) return;
		event.preventDefault();
	}
	function startDrag() {
		clearLongPress();
		dragStartedRef.current = true;
		setIsDragging(true);
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
			updateDragFromCurrentMouse,
		);
		addWindowDragListeners();
	}
	function updateDrag(clientX: number, clientY: number) {
		const coordinates = getDragCoordinates(clientX, clientY);
		setDragCoordinates(coordinates);

		const now = performance.now();
		if (now - lastDragUpdateRef.current < DRAG_UPDATE_INTERVAL) return;
		lastDragUpdateRef.current = now;
		onDragUpdateRef.current?.(coordinates);
	}
	function endDrag(clientX: number, clientY: number) {
		const coordinates = getDragCoordinates(clientX, clientY);
		const currentSnap = snapRef.current;
		const snappedCoordinates =
			currentSnap == 0
				? coordinates
				: {
						x: Math.round(coordinates.x / currentSnap) * currentSnap,
						y: Math.round(coordinates.y / currentSnap) * currentSnap,
					};
		setDragCoordinates(snappedCoordinates);
		onDragEndRef.current?.(snappedCoordinates);
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
		setIsDragging(false);
		longPressTriggeredRef.current = false;
		setHoverInteractionType(null);
		setEdgeScrollOverride(null);
		restoreUserSelect();
	}
	const cancel = useCallback(() => {
		const wasDragging = dragStartedRef.current;
		finishPointer();
		if (wasDragging) onDragCancelRef.current?.();
	}, []);
	function handleWindowMouseMove(event: MouseEvent) {
		if (!dragStartedRef.current) return;
		event.preventDefault();
		setDragMousePosition(event.clientX, event.clientY);
	}
	function handleWindowMouseUp(event: MouseEvent) {
		if (!dragStartedRef.current) return;
		endDrag(event.clientX, event.clientY);
		finishPointer();
	}
	function addWindowDragListeners() {
		window.addEventListener("mousemove", handleWindowMouseMove);
		window.addEventListener("mouseup", handleWindowMouseUp);
	}
	function removeWindowDragListeners() {
		window.removeEventListener("mousemove", handleWindowMouseMove);
		window.removeEventListener("mouseup", handleWindowMouseUp);
	}
	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (
				event.button !== 0 ||
				!enabledRef.current ||
				(resourceLock && resourceLock.userId != user?.id)
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
		[resourceLock, user?.id, clearLongPress],
	);
	const handlePointerMove = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (pointerIdRef.current !== event.pointerId) return;
			if (dragStartedRef.current) return;

			const distance = Math.hypot(
				event.clientX - pointerStartRef.current.x,
				event.clientY - pointerStartRef.current.y,
			);
			if (distance < DRAG_THRESHOLD) return;
			if (longPressTriggeredRef.current) return;
			event.preventDefault();
			setDragMousePosition(event.clientX, event.clientY);
			startDrag();
			updateDrag(event.clientX, event.clientY);
		},
		[],
	);
	const handlePointerUp = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (pointerIdRef.current !== event.pointerId) return;
			if (dragStartedRef.current) endDrag(event.clientX, event.clientY);
			finishPointer();
		},
		[],
	);

	const renderCoordinates =
		isDragging || isLocalDragging ? dragCoordinates : visualCoordinates;

	return {
		coordinates: renderCoordinates,
		isDragging,
		isLocalDragging,
		isRemoteDragging,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		cancel,
		clearLongPress,
	};
}
