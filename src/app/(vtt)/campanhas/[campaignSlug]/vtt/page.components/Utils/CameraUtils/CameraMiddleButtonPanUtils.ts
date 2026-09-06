"use client";

import { useEffect, useRef } from "react";
import { useVttInteractionContext } from "../../Contexts/VttInteractionContextProvider";
import {
	PIXELS_PER_CENTIMETER,
	useVttViewportContext,
} from "../../Contexts/VttViewportContextProvider";

export function useMiddleButtonCameraPan() {
	const { interaction } = useVttInteractionContext();
	const { moveCamera, camera } = useVttViewportContext();
	const { setHoverInteractionType } = useVttInteractionContext();
	const zoomRef = useRef(camera.zoom);

	zoomRef.current = camera.zoom;

	useEffect(() => {
		if (!interaction.allowMiddlePan) return;
		let isPanning = false;
		let lastMousePosition = {
			x: 0,
			y: 0,
		};

		const handleMouseDown = (event: MouseEvent) => {
			if (event.button !== 1) return;
			setHoverInteractionType("Hand");
			isPanning = true;
			lastMousePosition = {
				x: event.clientX,
				y: event.clientY,
			};
			event.preventDefault();
		};

		const handleMouseMove = (event: MouseEvent) => {
			if (!isPanning) return;
			const deltaX = event.clientX - lastMousePosition.x;
			const deltaY = event.clientY - lastMousePosition.y;
			lastMousePosition = {
				x: event.clientX,
				y: event.clientY,
			};
			const zoom = zoomRef.current;
			moveCamera(
				Math.round(-deltaX / (PIXELS_PER_CENTIMETER * zoom)),
				Math.round(-deltaY / (PIXELS_PER_CENTIMETER * zoom)),
			);
		};

		const handleMouseUp = (event: MouseEvent) => {
			if (event.button !== 1) return;
			setHoverInteractionType(null);
			isPanning = false;
		};

		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [interaction.allowMiddlePan, moveCamera]);
}
