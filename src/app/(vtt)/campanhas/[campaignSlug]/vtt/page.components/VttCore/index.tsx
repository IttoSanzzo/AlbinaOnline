"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttWebSocket } from "@/libs/stp@hooks/hooks/useVttWebSocket";
import { VttContextProvider } from "../Contexts/VttContextProvider";
import { CursorSyncronizer } from "./CursorSyncronizer";
import { VttMembersContextProvider } from "../Contexts/VttMembersProvider";
import { Campaign } from "@/libs/stp@types";
import {
	useVttViewportContext,
	VttViewportContextProvider,
} from "../Contexts/VttViewportContextProvider";
import {
	useVttInteractionContext,
	VttInteractionContextProvider,
} from "../Contexts/VttInteractionContextProvider";
import { VirtualUserCursor } from "./VirtualUserCursor";
import { useCursorHoverInteraction } from "../Utils/InteractionUtils";
import { useMiddleButtonCameraPan } from "../Utils/CameraUtils/CameraMiddleButtonPanUtils";
import { useWheelCameraZoom } from "../Utils/CameraUtils/CameraZoomUtils";
import { useEdgeCameraPan } from "../Utils/CameraUtils/CameraEdgePanUtils";

const VttCoreProvidersContainer = newStyledElement.div(
	styles.vttCoreProvidersContainer,
);
const VttCoreEngineContainer = newStyledElement.div(
	styles.vttCoreEngineContainer,
);

interface VttCoreProps {
	campaign: Campaign;
}
export function VttCore({ campaign }: VttCoreProps) {
	const { vttId } = useVttWebSocket();

	return (
		<VttCoreProvidersContainer>
			<VttContextProvider campaign={campaign}>
				<VttMembersContextProvider>
					<VttViewportContextProvider>
						<VttInteractionContextProvider>
							{`Connected to VttId: ${vttId}`}
							<VttCoreEngine />
						</VttInteractionContextProvider>
					</VttViewportContextProvider>
				</VttMembersContextProvider>
			</VttContextProvider>
		</VttCoreProvidersContainer>
	);
}

function VttCoreEngine() {
	useCursorHoverInteraction();
	useMiddleButtonCameraPan();
	useEdgeCameraPan();
	useWheelCameraZoom();

	return (
		<VttCoreEngineContainer>
			<TestZone />
			<CenterPointer />
			<CursorSyncronizer />
			<VirtualUserCursor />
		</VttCoreEngineContainer>
	);
}

// Test ////////////////////////////////////////////////////////////////////////
const TestContainer = newStyledElement.div(styles.testContainer);
const CenterPointer = newStyledElement.div(styles.centerPointer);

function TestZone() {
	const { camera, setCameraPosition, setZoom, worldToScreen, resetCamera } =
		useVttViewportContext();
	const { setInteraction } = useVttInteractionContext();

	const squarePosition = worldToScreen({
		x: 0,
		y: 0,
	});

	return (
		<TestContainer>
			<br />
			<button
				onClick={() => {
					setInteraction({
						type: "Default",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Mouse Default
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Brush",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Brush
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Chat",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Chat
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Menu",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Menu
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Move",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Move
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Eraser",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Eraser
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Hand",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Hand
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Measuring",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Measuring
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "DefaultUp",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				DefaultUp
			</button>
			<button
				onClick={() => {
					setInteraction({
						type: "Pointer",
						allowMiddlePan: true,
						allowEdgeScroll: false,
					});
				}}>
				Pointer
			</button>
			{/* <button onClick={() => document.exitPointerLock()}>Unlock Mouse</button> */}
			<br />
			<br />
			Viewport: {camera.x} {camera.y} {camera.zoom}
			<br />
			<button
				onClick={() => {
					setZoom(1);
				}}>
				Reset Zoom
			</button>
			<button
				onClick={() => {
					setZoom(Math.round((camera.zoom - 0.1) * 10) / 10);
				}}>
				Zoom Out
			</button>
			<button
				onClick={() => {
					setZoom(Math.round((camera.zoom + 0.1) * 10) / 10);
				}}>
				Zoom In
			</button>
			<br />
			<button
				onClick={() => {
					resetCamera();
				}}>
				Reset Cam
			</button>
			<button
				onClick={() => {
					setCameraPosition(camera.x, camera.y - 10);
				}}>
				Up
			</button>
			<button
				onClick={() => {
					setCameraPosition(camera.x - 10, camera.y);
				}}>
				Left
			</button>
			<button
				onClick={() => {
					setCameraPosition(camera.x + 10, camera.y);
				}}>
				Right
			</button>
			<button
				onClick={() => {
					setCameraPosition(camera.x, camera.y + 10);
				}}>
				Down
			</button>
			<span
				style={{
					position: "absolute",
					left: squarePosition.x - 50 * camera.zoom,
					top: squarePosition.y - 50 * camera.zoom,
					width: 100 * camera.zoom,
					height: 100 * camera.zoom,
				}}
			/>
		</TestContainer>
	);
}
