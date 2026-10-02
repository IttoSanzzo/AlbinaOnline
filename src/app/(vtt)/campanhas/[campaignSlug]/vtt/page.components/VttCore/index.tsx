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
import { WindowStates } from "../Contexts/WindowStates";
import {
	VttElementDataAttribute,
	setVttElementDataAttributes,
} from "../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../Types/VttMouseState";

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
			<WindowStates>
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
			</WindowStates>
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
	// const { subscribe } = useVttContext();
	// const [vttResultsTest, setVttResultsTest] = useState<string>("");

	// useEffect(() => {
	// const unsubscribe1 = subscribe("VttAllDiceResults", (event) => {
	// 	setVttResultsTest(JSON.stringify(event.data));
	// });
	// const unsubscribe2 = subscribe("VttDiceResult", (event) => {
	// 	setVttResultsTest((state) => `${state}\n\n${JSON.stringify(event.data)}`);
	// });
	// return () => {
	// 	unsubscribe1();
	// 	unsubscribe2();
	// };
	// }, []);

	const square1Position = worldToScreen({
		x: 0,
		y: 0,
	});
	const square2Position = worldToScreen({
		x: 100,
		y: 100,
	});
	const square3Position = worldToScreen({
		x: 200,
		y: 200,
	});

	return (
		<TestContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}>
			<br />

			{Object.keys(VttCursorInteractionType).map((key) => (
				<button
					key={key}
					onClick={() => {
						setInteraction({
							type: key as VttCursorInteractionType,
							allowMiddlePan: true,
							allowEdgeScroll: false,
							edgeScrollOverride: null,
						});
					}}>
					{key}
				</button>
			))}

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
			<span
				style={{
					position: "absolute",
					left: square3Position.x,
					top: square3Position.y,
					overflowWrap: "break-word",
					wordBreak: "normal",
					whiteSpace: "pre-wrap",
				}}>
				{/* {vttResultsTest} */}
			</span>
		</TestContainer>
	);
}
