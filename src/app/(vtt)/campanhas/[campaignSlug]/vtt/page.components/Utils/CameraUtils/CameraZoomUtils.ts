"use client";

import { useEffect, useRef } from "react";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";

export function useWheelCameraZoom() {
	const { zoomAt, resetCamera, resetZoom, camera } = useVttViewportContext();
	const zoomRef = useRef(camera.zoom);
	zoomRef.current = camera.zoom;

	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();

			const zoom = zoomRef.current;
			const zoomFactor = Math.exp(-event.deltaY * 0.001);
			const nextZoom = zoom * zoomFactor;

			zoomAt(
				{
					x: event.clientX,
					y: event.clientY,
				},
				nextZoom,
			);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.code === "Digit0") {
				event.preventDefault();
				if (event.shiftKey) resetCamera();
				else resetZoom();
			}
		};
		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [zoomAt, resetCamera]);
}
