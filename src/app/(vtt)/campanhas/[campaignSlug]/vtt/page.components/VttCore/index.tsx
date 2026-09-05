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

const VttCoreProvidersContainer = newStyledElement.div(
	styles.vttCoreProvidersContainer,
);
const VttCoreContainer = newStyledElement.div(styles.vttCoreContainer);

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
						{`Connected to VttId: ${vttId}`}
						<VttCoreContainer>
							<TestZone />
							<CenterPointer />
							<CursorSyncronizer />
						</VttCoreContainer>
					</VttViewportContextProvider>
				</VttMembersContextProvider>
			</VttContextProvider>
		</VttCoreProvidersContainer>
	);
}

// Test ////////////////////////////////////////////////////////////////////////
const TestContainer = newStyledElement.div(styles.testContainer);
const CenterPointer = newStyledElement.div(styles.centerPointer);

function TestZone() {
	const { camera, setCameraPosition, setZoom, worldToScreen, resetCamera } =
		useVttViewportContext();

	const squarePosition = worldToScreen({
		x: 0,
		y: 0,
	});

	return (
		<TestContainer>
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
