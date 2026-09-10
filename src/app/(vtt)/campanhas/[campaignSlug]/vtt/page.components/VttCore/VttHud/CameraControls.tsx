"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import { useVttInteractionContext } from "../../Contexts/VttInteractionContextProvider";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";
import styles from "./CameraControls.module.css";
import { DEFAULT_GRID_CELL_SIZE } from "../../Contexts/VttGridProvider";
import { useEffect } from "react";

const CameraControlsContainer = newStyledElement.div(
	styles.cameraControlsContainer,
);
const CameraControl = newStyledElement.button(styles.cameraControl);
const Separator = newStyledElement.span(styles.separator);

const SWITCH_EDGE_PAN_KEY = "p";

export function CameraControls() {
	const { camera, resetPosition, resetZoom } = useVttViewportContext();
	const { interaction, setInteraction } = useVttInteractionContext();

	function toggleEdgePan() {
		setInteraction({
			...interaction,
			allowEdgeScroll: !interaction.allowEdgeScroll,
		});
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.repeat ||
				!(event.ctrlKey && event.key.toLowerCase() === SWITCH_EDGE_PAN_KEY)
			)
				return;

			toggleEdgePan();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [toggleEdgePan]);

	return (
		<CameraControlsContainer>
			<CameraControl
				onClick={resetPosition}
				title="Reset position"
				data-cursor-hover-interaction-type={"Pointer"}>
				{Math.floor(camera.x / DEFAULT_GRID_CELL_SIZE)},{" "}
				{Math.floor(camera.y / DEFAULT_GRID_CELL_SIZE)}
			</CameraControl>

			<Separator>·</Separator>

			<CameraControl
				onClick={resetZoom}
				title="Reset zoom"
				data-cursor-hover-interaction-type={"Pointer"}>
				{camera.zoom.toFixed(1)}×
			</CameraControl>

			<Separator>·</Separator>

			<CameraControl
				className={
					interaction.edgeScrollOverride
						? styles.activeOverride
						: interaction.allowEdgeScroll
							? styles.active
							: undefined
				}
				onClick={toggleEdgePan}
				title="Toggle edge pan"
				data-cursor-hover-interaction-type={"Pointer"}>
				<span className={styles.edgePanIndicator} />
				EP
			</CameraControl>
		</CameraControlsContainer>
	);
}
