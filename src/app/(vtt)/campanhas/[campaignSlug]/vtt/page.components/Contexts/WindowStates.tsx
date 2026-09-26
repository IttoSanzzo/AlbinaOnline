"use client";

import { ReactNode, useEffect } from "react";

export interface WindowCursorState {
	x: number;
	y: number;
	element: Element | null;
	buttons: number;
}
export const WindowCursorState: WindowCursorState = {
	x: 0,
	y: 0,
	buttons: 0,
	element: null,
};

export interface WindowKeyboardState {
	shift: boolean;
	ctrl: boolean;
	alt: boolean;
	meta: boolean;
}
export const WindowKeyboardState: WindowKeyboardState = {
	shift: false,
	ctrl: false,
	alt: false,
	meta: false,
};

interface WindowStatesProps {
	children: ReactNode;
}
export function WindowStates({ children }: WindowStatesProps) {
	useEffect(() => {
		WindowCursorState.x = window.screenX / 2;
		WindowCursorState.y = window.screenY / 2;

		function handleMouseMove(event: MouseEvent) {
			WindowCursorState.x = event.x;
			WindowCursorState.y = event.y;
			WindowCursorState.buttons = event.buttons;
			WindowCursorState.element =
				event.target instanceof Element ? event.target : null;
		}
		function handleKeyDown(event: KeyboardEvent) {
			WindowKeyboardState.shift = event.shiftKey;
			WindowKeyboardState.ctrl = event.ctrlKey;
			WindowKeyboardState.alt = event.altKey;
			WindowKeyboardState.meta = event.metaKey;
		}
		function handleKeyUp(event: KeyboardEvent) {
			WindowKeyboardState.shift = event.shiftKey;
			WindowKeyboardState.ctrl = event.ctrlKey;
			WindowKeyboardState.alt = event.altKey;
			WindowKeyboardState.meta = event.metaKey;
		}
		function handleWindowBlur() {
			WindowKeyboardState.shift = false;
			WindowKeyboardState.ctrl = false;
			WindowKeyboardState.alt = false;
			WindowKeyboardState.meta = false;
		}

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("blur", handleWindowBlur);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("blur", handleWindowBlur);
		};
	}, []);

	return children;
}
