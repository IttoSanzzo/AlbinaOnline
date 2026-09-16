"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttWebSocket } from "@/libs/stp@hooks/hooks/useVttWebSocket";
import { VttContextProvider } from "../Contexts/VttContextProvider";
import { CursorSyncronizer } from "./CursorSyncronizer";
import { VttMembersContextProvider } from "../Contexts/VttMembersProvider";
import { Campaign } from "@/libs/stp@types";
import {
	PIXELS_PER_CENTIMETER,
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
import { VttGridContextProvider } from "../Contexts/VttGridProvider";
import { VirtualGridView } from "./VirtualGridView";
import { RadialMenuProvider } from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { PingEngine } from "./Other/PingEngine";
import { PlayerConnectionChange } from "./Other/PureEventHandlers/PlayerConnectionChange";
import { AudioManagerProvider } from "../Contexts/AudioManager/AudioManagerContext";
import { VttLocalSettingsProvider } from "../Contexts/VttLocalSettings/VttLocalSettingsProvider";
import { VttAudioControllerProvider } from "../Contexts/AudioManager/VttAudioControllerContext";
import { VttHud } from "./VttHud";
import { GeneralShortcutsEngine } from "./Other/GeneralShortcutsEngine";
import { DDDiceIntegration } from "./DDDiceIntegration";

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
			<AudioManagerProvider>
				<VttLocalSettingsProvider vttId={vttId}>
					<VttAudioControllerProvider>
						<VttContextProvider campaign={campaign}>
							<VttMembersContextProvider>
								<VttViewportContextProvider>
									<VttGridContextProvider>
										<VttInteractionContextProvider>
											<RadialMenuProvider>
												{`Connected to VttId: ${vttId}`}
												<VttCoreEngine />
											</RadialMenuProvider>
										</VttInteractionContextProvider>
									</VttGridContextProvider>
								</VttViewportContextProvider>
							</VttMembersContextProvider>
						</VttContextProvider>
					</VttAudioControllerProvider>
				</VttLocalSettingsProvider>
			</AudioManagerProvider>
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
			<GeneralShortcutsEngine />
			<VirtualGridView />
			<TestZone />
			<DDDiceIntegration />
			<PingEngine />
			<CursorSyncronizer />
			<PlayerConnectionChange />
			<VttHud />
			<VirtualUserCursor />
		</VttCoreEngineContainer>
	);
}

// Test ////////////////////////////////////////////////////////////////////////
const TestContainer = newStyledElement.div(styles.testContainer);

function TestZone() {
	const { camera, worldToScreen } = useVttViewportContext();
	const { setInteraction } = useVttInteractionContext();

	const square1Position = worldToScreen({
		x: 0,
		y: 0,
	});
	const square2Position = worldToScreen({
		x: 100,
		y: 100,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
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
						edgeScrollOverride: null,
					});
				}}>
				Pointer
			</button>

			<span
				style={{
					position: "absolute",
					left: square1Position.x,
					top: square1Position.y,
					width: 100 * PIXELS_PER_CENTIMETER * camera.zoom,
					height: 100 * PIXELS_PER_CENTIMETER * camera.zoom,
				}}
			/>
			<span
				style={{
					position: "absolute",
					left: square2Position.x,
					top: square2Position.y,
					width: 100 * PIXELS_PER_CENTIMETER * camera.zoom,
					height: 100 * PIXELS_PER_CENTIMETER * camera.zoom,
				}}
			/>
		</TestContainer>
	);
}
