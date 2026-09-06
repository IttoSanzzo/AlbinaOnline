"use client";

import { useEffect, useRef } from "react";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";

export function useWheelCameraZoom() {
	const { zoomAt, camera } = useVttViewportContext();
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

		window.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			window.removeEventListener("wheel", handleWheel);
		};
	}, [zoomAt]);
}
