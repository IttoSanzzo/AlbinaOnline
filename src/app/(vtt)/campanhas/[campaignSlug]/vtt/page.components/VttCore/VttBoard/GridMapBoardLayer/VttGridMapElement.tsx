"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttGridMapElement.module.css";
import {
	memo,
	PointerEvent as ReactPointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { PIXELS_PER_CENTIMETER } from "../../../Contexts/VttViewportContextProvider";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import {
	RadialMenuContext,
	useRadialMenu,
} from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { WindowCursorState } from "../../../Contexts/WindowStates";
import { RadialMenuOption } from "@/components/(SPECIAL)/components/RadialMenu/types";
import { StandartTextColor } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";
import { clamp, wrap } from "@/utils/Math";
import { Guid } from "@/libs/stp@types";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { VttInputMessage } from "../../../Types/Core/VttInputMessage";
import { useVttInteractionContext } from "../../../Contexts/VttInteractionContextProvider";
import { VttCursorInteractionType } from "../../../Types/Classes/VttMouseState";
import { useCurrentUser } from "@/libs/stp@hooks";
import { DEFAULT_GRID_CELL_SIZE } from "../../../Contexts/VttGridProvider";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";

const VttGridMapElementContainer = newStyledElement.div(
	styles.vttGridMapElementContainer,
);

const DRAG_THRESHOLD = 5;
const LONG_PRESS_DURATION = 500;
const DRAG_UPDATE_INTERVAL = 1000 / 10;
const REMOTE_INTERPOLATION_DURATION = 100;

interface VttGridMapElementProps {
	vttGridMap: VttGridMap;
}
export const VttGridMapElement = memo(function VttGridMapElement({
	vttGridMap,
}: VttGridMapElementProps) {
	const { worldToScreen, screenToWorld, camera } =
		useVttThrottledViewportContext(16);
	const { activeLayer } = useVttBoardLayerContext();
	const { send, subscribe } = useVttContext();
	const { setHoverInteractionType, setEdgeScrollOverride } =
		useVttInteractionContext();
	const { user } = useCurrentUser();
	const radialMenu = useRadialMenu();

	const [dragCoordinates, setDragCoordinates] = useState(
		vttGridMap.coordinates,
	);
	const [visualCoordinates, setVisualCoordinates] = useState(
		vttGridMap.coordinates,
	);

	const pointerIdRef = useRef<number | null>(null);
	const pointerStartRef = useRef({ x: 0, y: 0 });
	const dragStartCoordinatesRef = useRef(vttGridMap.coordinates);
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
	const remoteAnimationFromRef = useRef(vttGridMap.coordinates);
	const remoteAnimationToRef = useRef(vttGridMap.coordinates);
	const visualCoordinatesRef = useRef(vttGridMap.coordinates);
	const remoteDragInitializedRef = useRef(false);

	screenToWorldRef.current = screenToWorld;

	const dragResourceLock = vttGridMap.resourceLocks.find(
		(lock) => lock.lockType == "drag",
	);
	const doSnapping: number = DEFAULT_GRID_CELL_SIZE;
	const isActiveInLayer = activeLayer == VttBoardLayer.GridMap;

	const coordinates = worldToScreen(
		dragStartedRef.current || dragResourceLock?.userId == user?.id
			? dragCoordinates
			: visualCoordinates,
	);
	const x =
		coordinates.x -
		vttGridMap.gridMap.offsetX * PIXELS_PER_CENTIMETER * camera.zoom;
	const y =
		coordinates.y -
		vttGridMap.gridMap.offsetY * PIXELS_PER_CENTIMETER * camera.zoom;
	const width = vttGridMap.gridMap.width * PIXELS_PER_CENTIMETER * camera.zoom;
	const height =
		vttGridMap.gridMap.height * PIXELS_PER_CENTIMETER * camera.zoom;

	useEffect(() => {
		if (dragStartedRef.current) return;
		setDragCoordinates(vttGridMap.coordinates);
	}, [vttGridMap.coordinates]);
	useEffect(() => {
		const isRemoteDrag =
			dragResourceLock?.lockType == "drag" &&
			dragResourceLock.userId != user?.id;

		if (!isRemoteDrag) {
			if (remoteAnimationFrameRef.current !== null) {
				cancelAnimationFrame(remoteAnimationFrameRef.current);
				remoteAnimationFrameRef.current = null;
			}
			remoteDragInitializedRef.current = false;
			visualCoordinatesRef.current = vttGridMap.coordinates;
			setVisualCoordinates(vttGridMap.coordinates);
			return;
		}

		if (!remoteDragInitializedRef.current) {
			remoteDragInitializedRef.current = true;
			remoteAnimationFromRef.current = vttGridMap.coordinates;
			remoteAnimationToRef.current = vttGridMap.coordinates;
			visualCoordinatesRef.current = vttGridMap.coordinates;
			setVisualCoordinates(vttGridMap.coordinates);
			return;
		}

		remoteAnimationStartRef.current = performance.now();
		remoteAnimationFromRef.current = visualCoordinatesRef.current;
		remoteAnimationToRef.current = vttGridMap.coordinates;

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
	}, [vttGridMap.coordinates, dragResourceLock?.userId, user?.id]);
	useEffect(() => {
		const unsubscribe = subscribe("VttGridMapDragCanceled", (event) => {
			const payload = event.data as {
				vttGridMapId: Guid;
			};
			if (payload.vttGridMapId != vttGridMap.id) return;
			finishPointer();
		});
		return unsubscribe;
	}, [subscribe, vttGridMap.id]);
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

	function clearLongPress() {
		if (longPressTimeoutRef.current === null) return;
		clearTimeout(longPressTimeoutRef.current);
		longPressTimeoutRef.current = null;
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
		setHoverInteractionType(VttCursorInteractionType.Hand);
		setEdgeScrollOverride(true);
		dragStartCoordinatesRef.current = {
			...vttGridMap.coordinates,
		};
		const cursorWorldPosition = screenToWorldRef.current({
			x: pointerStartRef.current.x,
			y: pointerStartRef.current.y,
		});
		dragOffsetRef.current = {
			x: vttGridMap.coordinates.x - cursorWorldPosition.x,
			y: vttGridMap.coordinates.y - cursorWorldPosition.y,
		};
		lastDragUpdateRef.current = performance.now();
		preventSelection();
		send({
			id: Guid.NewGuid(),
			path: "/scenes/gridmaps/drag",
			method: "Post",
			data: {
				vttGridMapId: vttGridMap.id,
			},
		});
		setDragCoordinates(dragStartCoordinatesRef.current);
		dragAnimationFrameRef.current = requestAnimationFrame(
			updateDragFromCurrentMouse,
		);
		addWindowDragListeners();
	}
	function updateDrag(clientX: number, clientY: number, forceSend = false) {
		const coordinates = getDragCoordinates(clientX, clientY);
		setDragCoordinates(coordinates);

		const now = performance.now();
		if (!forceSend && now - lastDragUpdateRef.current < DRAG_UPDATE_INTERVAL)
			return;
		lastDragUpdateRef.current = now;

		send({
			id: Guid.NewGuid(),
			path: "/scenes/gridmaps/drag",
			method: "Patch",
			data: {
				vttGridMapId: vttGridMap.id,
				coordinates,
			},
		});
	}
	function endDrag(clientX: number, clientY: number) {
		const coordinates = getDragCoordinates(clientX, clientY);
		const snappedCoordinates =
			doSnapping == 0
				? coordinates
				: {
						x: Math.round(coordinates.x / doSnapping) * doSnapping,
						y: Math.round(coordinates.y / doSnapping) * doSnapping,
					};
		setDragCoordinates(snappedCoordinates);
		send({
			id: Guid.NewGuid(),
			path: "/scenes/gridmaps/drag",
			method: "Put",
			data: {
				vttGridMapId: vttGridMap.id,
				coordinates: snappedCoordinates,
			},
		});
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
		longPressTriggeredRef.current = false;
		setHoverInteractionType(null);
		setEdgeScrollOverride(null);
		restoreUserSelect();
	}
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
	function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
		if (
			event.button !== 0 ||
			!isActiveInLayer ||
			(dragResourceLock && dragResourceLock.userId != user?.id)
		)
			return;
		pointerIdRef.current = event.pointerId;
		pointerStartRef.current = {
			x: event.clientX,
			y: event.clientY,
		};
		setDragMousePosition(event.clientX, event.clientY);
		dragStartCoordinatesRef.current = {
			...vttGridMap.coordinates,
		};
		dragStartedRef.current = false;
		longPressTriggeredRef.current = false;
		clearLongPress();
		longPressTimeoutRef.current = setTimeout(() => {
			if (pointerIdRef.current !== event.pointerId) return;
			if (dragStartedRef.current) return;
			longPressTriggeredRef.current = true;
			openRadialMenu(vttGridMap, send, radialMenu);
			pointerIdRef.current = null;
			clearLongPress();
		}, LONG_PRESS_DURATION);
	}
	function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
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
	}
	function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
		if (pointerIdRef.current !== event.pointerId) return;
		if (dragStartedRef.current) endDrag(event.clientX, event.clientY);
		finishPointer();
	}

	return (
		<VttGridMapElementContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}
			className={isActiveInLayer ? styles.activeLayer : undefined}
			style={{
				rotate: `${vttGridMap.transform.rotation}deg`,
				scale: `${vttGridMap.transform.horizontalMirror ? -1 : 1} ${vttGridMap.transform.verticalMirror ? -1 : 1}`,
				touchAction: "none",
				...(dragResourceLock
					? dragResourceLock.userId == user?.id
						? { outlineColor: "blue", zIndex: 10000 }
						: { outlineColor: "yellow", zIndex: 9999 }
					: undefined),
			}}
			data-vtt-board-x={x}
			data-vtt-board-y={y}
			data-vtt-board-height={height}
			data-vtt-board-width={width}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onContextMenu={(event) => {
				event.preventDefault();
				clearLongPress();
				openRadialMenu(vttGridMap, send, radialMenu);
			}}>
			<BasicMedia
				src={vttGridMap.gridMap.imageUrl}
				alt={vttGridMap.gridMap.name}
				className={styles.media}
				fill
				style={{
					pointerEvents: "none",
					opacity: vttGridMap.transform.opacity / 100,
				}}
			/>
		</VttGridMapElementContainer>
	);
});

function openRadialMenu(
	vttGridMap: VttGridMap,
	send: (message: VttInputMessage) => void,
	radialMenu: RadialMenuContext,
) {
	radialMenu.openNew({
		id: vttGridMap.id,
		name: "GridMap",
		screenPosition: { x: WindowCursorState.x, y: WindowCursorState.y },
		actionPosition: { x: 0, y: 0 },
		options: radialMenuOptions,
		nameColor: StandartTextColor["lightGray"],
		ringWidths: [120],
		onSubmit: (data) => {
			const newVttGridMap = vttGridMap;
			switch (data.option.id) {
				case "Cancel":
					data.close();
					return;
				case "BringUp":
					break;
				case "Opacity+":
					newVttGridMap.transform.opacity = clamp(
						newVttGridMap.transform.opacity + 10,
						0,
						100,
					);
					break;
				case "Opacity-":
					newVttGridMap.transform.opacity = clamp(
						newVttGridMap.transform.opacity - 10,
						0,
						100,
					);
					break;
				case "Rotate+":
					newVttGridMap.transform.rotation = wrap(
						newVttGridMap.transform.rotation + 90,
						0,
						360,
					);
					break;
				case "Rotate-":
					newVttGridMap.transform.rotation = wrap(
						newVttGridMap.transform.rotation - 90,
						0,
						360,
					);
					break;
				case "MirrorX":
					newVttGridMap.transform.horizontalMirror =
						!newVttGridMap.transform.horizontalMirror;
					break;
				case "MirrorY":
					newVttGridMap.transform.verticalMirror =
						!newVttGridMap.transform.verticalMirror;
					break;
				case "Delete": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/scenes/gridmaps",
						method: "Delete",
						data: { vttGridMapId: vttGridMap.id },
					});
					return;
				}
			}
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps",
				method: "Put",
				data: { vttGridMap: newVttGridMap },
			});
			if (data.option.id == "BringUp") data.close();
		},
	});
}
const radialMenuOptions: RadialMenuOption[] = [
	{
		id: "Cancel",
		name: "Cancelar",
		icon: undefined,
		nameColor: StandartTextColor["lightGray"],
		backgroundColor: StandartTextColor["darkerGray"],
	},
	{
		id: "BringUp",
		name: "PinUp",
		icon: undefined,
	},
	{
		id: "Opacity+",
		name: "Opacidade +",
		icon: undefined,
	},
	{
		id: "Opacity-",
		name: "Opacidade -",
		icon: undefined,
	},
	{
		id: "Rotate+",
		name: "Rotacionar +",
		icon: undefined,
	},
	{
		id: "Rotate-",
		name: "Rotacionar -",
		icon: undefined,
	},
	{
		id: "MirrorX",
		name: "Espelhar X",
		icon: undefined,
	},
	{
		id: "MirrorY",
		name: "Espelhar Y",
		icon: undefined,
	},
	{
		id: "Delete",
		name: "Remover",
		icon: (
			<StpIcon
				name={"Trash"}
				color={"black"}
			/>
		),
		nameColor: StandartTextColor["black"],
		backgroundColor: StandartTextColor["darkRed"],
	},
];
