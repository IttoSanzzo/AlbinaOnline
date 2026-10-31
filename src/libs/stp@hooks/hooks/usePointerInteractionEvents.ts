import {
	PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useRef,
} from "react";

const DEFAULT_PRESS_DURATION = 500;
const DEFAULT_MOVE_THRESHOLD = 5;

type PointerButton = 0 | 2;

interface PointerInteractionEventsOptions {
	onLeftClick?: (event: globalThis.PointerEvent) => void;
	onRightClick?: (event: globalThis.PointerEvent) => void;
	onLeftPress?: (event: globalThis.PointerEvent) => void;
	onRightPress?: (event: globalThis.PointerEvent) => void;
	pressDuration?: number;
	moveThreshold?: number;
}

interface PointerInteractionState {
	pointerId: number;
	button: PointerButton;
	startX: number;
	startY: number;
	moved: boolean;
	pressed: boolean;
	timeout: ReturnType<typeof setTimeout> | null;
}

export function usePointerInteractionEvents({
	onLeftClick,
	onRightClick,
	onLeftPress,
	onRightPress,
	pressDuration = DEFAULT_PRESS_DURATION,
	moveThreshold = DEFAULT_MOVE_THRESHOLD,
}: PointerInteractionEventsOptions) {
	const callbacksRef = useRef({
		onLeftClick,
		onRightClick,
		onLeftPress,
		onRightPress,
	});
	callbacksRef.current = {
		onLeftClick,
		onRightClick,
		onLeftPress,
		onRightPress,
	};

	const interactionRef = useRef<PointerInteractionState | null>(null);

	const clearInteraction = useCallback(() => {
		const interaction = interactionRef.current;
		if (!interaction) return;

		if (interaction.timeout !== null) {
			clearTimeout(interaction.timeout);
		}

		interactionRef.current = null;

		window.removeEventListener("pointermove", handleWindowPointerMove);
		window.removeEventListener("pointerup", handleWindowPointerUp);
		window.removeEventListener("pointercancel", handleWindowPointerCancel);
	}, []);

	const handlePointerMove = useCallback(
		(event: globalThis.PointerEvent) => {
			const interaction = interactionRef.current;
			if (!interaction || interaction.pointerId !== event.pointerId) return;

			if (interaction.moved) return;

			const distance = Math.hypot(
				event.clientX - interaction.startX,
				event.clientY - interaction.startY,
			);

			if (distance <= moveThreshold) return;

			interaction.moved = true;

			if (interaction.timeout !== null) {
				clearTimeout(interaction.timeout);
				interaction.timeout = null;
			}
		},
		[moveThreshold],
	);

	const handlePointerUp = useCallback(
		(event: globalThis.PointerEvent) => {
			const interaction = interactionRef.current;
			if (!interaction || interaction.pointerId !== event.pointerId) return;

			if (!interaction.moved && !interaction.pressed) {
				const callback =
					interaction.button === 0
						? callbacksRef.current.onLeftClick
						: callbacksRef.current.onRightClick;

				callback?.(event);
			}

			clearInteraction();
		},
		[clearInteraction],
	);

	const handlePointerCancel = useCallback(
		(event: globalThis.PointerEvent) => {
			if (interactionRef.current?.pointerId !== event.pointerId) return;
			clearInteraction();
		},
		[clearInteraction],
	);

	const handleWindowPointerMove = useCallback(
		(event: globalThis.PointerEvent) => {
			handlePointerMove(event);
		},
		[handlePointerMove],
	);

	const handleWindowPointerUp = useCallback(
		(event: globalThis.PointerEvent) => {
			handlePointerUp(event);
		},
		[handlePointerUp],
	);

	const handleWindowPointerCancel = useCallback(
		(event: globalThis.PointerEvent) => {
			handlePointerCancel(event);
		},
		[handlePointerCancel],
	);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (event.button !== 0 && event.button !== 2) return;
			if (interactionRef.current !== null) return;

			const button = event.button as PointerButton;
			const callbacks = callbacksRef.current;

			const clickCallback =
				button === 0 ? callbacks.onLeftClick : callbacks.onRightClick;
			const pressCallback =
				button === 0 ? callbacks.onLeftPress : callbacks.onRightPress;

			if (!clickCallback && !pressCallback) return;

			const interaction: PointerInteractionState = {
				pointerId: event.pointerId,
				button,
				startX: event.clientX,
				startY: event.clientY,
				moved: false,
				pressed: false,
				timeout: null,
			};

			interactionRef.current = interaction;

			window.addEventListener("pointermove", handleWindowPointerMove);
			window.addEventListener("pointerup", handleWindowPointerUp);
			window.addEventListener("pointercancel", handleWindowPointerCancel);

			if (pressCallback) {
				interaction.timeout = setTimeout(() => {
					if (interactionRef.current !== interaction) return;
					if (interaction.moved) return;

					interaction.pressed = true;
					interaction.timeout = null;

					const callback =
						interaction.button === 0
							? callbacksRef.current.onLeftPress
							: callbacksRef.current.onRightPress;

					callback?.(event.nativeEvent);
				}, pressDuration);
			}
		},
		[
			pressDuration,
			handleWindowPointerMove,
			handleWindowPointerUp,
			handleWindowPointerCancel,
		],
	);

	const handlePointerMoveEvent = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			handlePointerMove(event.nativeEvent);
		},
		[handlePointerMove],
	);

	const handlePointerUpEvent = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			handlePointerUp(event.nativeEvent);
		},
		[handlePointerUp],
	);

	const handlePointerCancelEvent = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			handlePointerCancel(event.nativeEvent);
		},
		[handlePointerCancel],
	);

	useEffect(() => {
		return clearInteraction;
	}, [clearInteraction]);

	return {
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMoveEvent,
		onPointerUp: handlePointerUpEvent,
		onPointerCancel: handlePointerCancelEvent,
	};
}
