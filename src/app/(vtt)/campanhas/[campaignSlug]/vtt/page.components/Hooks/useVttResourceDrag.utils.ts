import { Guid } from "@/libs/stp@types";

interface PendingForward {
	timer: ReturnType<typeof setTimeout>;
	activated: boolean;
	cleanup: () => void;
}

const pendingForwards = new Map<string, PendingForward>();

const FORWARD_ACTIVATION_DELAY = 250;

interface ForwardToTokenProps {
	tokenId: Guid;
	onPointerDownActivationDelay?: number;
}
export function forwardToToken({
	tokenId,
	onPointerDownActivationDelay = FORWARD_ACTIVATION_DELAY,
}: ForwardToTokenProps) {
	return {
		onPointerDown: (event: React.PointerEvent) => {
			const pointerId = event.pointerId;
			const key = `${tokenId}:${pointerId}`;

			pendingForwards.get(key)?.cleanup();

			const pointerData = {
				clientX: event.clientX,
				clientY: event.clientY,
				pointerId,
				pointerType: event.pointerType,
				button: event.button,
				buttons: event.buttons,
			};

			const handlePointerUp = (upEvent: PointerEvent) => {
				if (upEvent.pointerId !== pointerId) return;

				const pending = pendingForwards.get(key);
				if (!pending) return;

				pending.cleanup();

				if (pending.activated) return;

				const element = document.getElementById(
					`board-token-anchor-${tokenId}`,
				);
				element?.dispatchEvent(
					new MouseEvent("click", {
						bubbles: true,
						cancelable: true,
						clientX: upEvent.clientX,
						clientY: upEvent.clientY,
						button: upEvent.button,
						buttons: 0,
					}),
				);
			};

			const handlePointerCancel = (cancelEvent: PointerEvent) => {
				if (cancelEvent.pointerId !== pointerId) return;
				pendingForwards.get(key)?.cleanup();
			};

			const pending: PendingForward = {
				activated: false,
				timer: setTimeout(() => {
					const element = document.getElementById(
						`board-token-anchor-${tokenId}`,
					);
					if (!element) {
						pending.cleanup();
						return;
					}

					pending.activated = true;

					const pointerEvent = new PointerEvent("pointerdown", {
						bubbles: true,
						cancelable: true,
						...pointerData,
					});

					Object.assign(pointerEvent, {
						centerOnPointer: true,
					});

					element.dispatchEvent(pointerEvent);
				}, onPointerDownActivationDelay),
				cleanup: () => {
					clearTimeout(pending.timer);
					window.removeEventListener("pointerup", handlePointerUp);
					window.removeEventListener("pointercancel", handlePointerCancel);
					pendingForwards.delete(key);
				},
			};

			pendingForwards.set(key, pending);

			window.addEventListener("pointerup", handlePointerUp);
			window.addEventListener("pointercancel", handlePointerCancel);
		},
	};
}
