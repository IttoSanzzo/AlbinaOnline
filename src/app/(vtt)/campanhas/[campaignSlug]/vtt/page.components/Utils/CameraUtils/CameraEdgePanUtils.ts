"use client";

import { useEffect, useRef } from "react";
import { useVttInteractionContext } from "../../Contexts/VttInteractionContextProvider";
import {
	PIXELS_PER_CENTIMETER,
	useVttViewportContext,
} from "../../Contexts/VttViewportContextProvider";

const EDGE_SIZE = 50;
const MAX_SPEED = 20;
const UPDATE_INTERVAL = 33;

export function useEdgeCameraPan() {
	const { interaction } = useVttInteractionContext();
	const { moveCamera, camera, viewport } = useVttViewportContext();

	const mousePosition = useRef({
		x: viewport.width / 2,
		y: viewport.height / 2,
	});

	const zoomRef = useRef(camera.zoom);
	zoomRef.current = camera.zoom;

	useEffect(() => {
		const edgePanEnabled =
			interaction.edgeScrollOverride ?? interaction.allowEdgeScroll;
		if (!edgePanEnabled) return;

		const handleMouseMove = (event: MouseEvent) => {
			mousePosition.current = {
				x: event.clientX,
				y: event.clientY,
			};
		};

		const handleEdgePan = () => {
			const { x, y } = mousePosition.current;

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			let directionX = 0;
			let directionY = 0;

			let strengthX = 0;
			let strengthY = 0;

			if (x < EDGE_SIZE) {
				directionX = -1;
				strengthX = 1 - x / EDGE_SIZE;
			} else if (x > viewportWidth - EDGE_SIZE) {
				directionX = 1;
				strengthX = 1 - (viewportWidth - x) / EDGE_SIZE;
			}

			if (y < EDGE_SIZE) {
				directionY = -1;
				strengthY = 1 - y / EDGE_SIZE;
			} else if (y > viewportHeight - EDGE_SIZE) {
				directionY = 1;
				strengthY = 1 - (viewportHeight - y) / EDGE_SIZE;
			}

			if (directionX === 0 && directionY === 0) return;

			const zoom = zoomRef.current;
			const speedX = MAX_SPEED * strengthX;
			const speedY = MAX_SPEED * strengthY;

			moveCamera(
				Math.round((directionX * speedX) / (PIXELS_PER_CENTIMETER * zoom)),
				Math.round((directionY * speedY) / (PIXELS_PER_CENTIMETER * zoom)),
			);
		};

		window.addEventListener("mousemove", handleMouseMove);
		const interval = window.setInterval(handleEdgePan, UPDATE_INTERVAL);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.clearInterval(interval);
		};
	}, [interaction.allowEdgeScroll, moveCamera]);
}
