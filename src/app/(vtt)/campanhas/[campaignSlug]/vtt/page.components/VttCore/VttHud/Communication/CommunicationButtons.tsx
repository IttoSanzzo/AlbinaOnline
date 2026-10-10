import { Dispatch, SetStateAction } from "react";
import { VttHudGenericButtonA } from "../../../Components/VttHudGenericButtonA";
import { useVttLocalSettings } from "../../../Contexts/VttLocalSettings/VttLocalSettingsProvider";
import styles from "./CommunicationButtons.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";

const CommunicationButtonsContainer = newStyledElement.div(
	styles.communicationButtonsContainer,
);

interface CommunicationButtonsProps {
	showChatState: [boolean, Dispatch<SetStateAction<boolean>>];
}
export function CommunicationButtons({
	showChatState: [showChat, setShowChat],
}: CommunicationButtonsProps) {
	const { settings, updateAudioSettings } = useVttLocalSettings();

	return (
		<CommunicationButtonsContainer>
			<VttHudGenericButtonA
				withRoughBorderRadius
				stpIconName={settings.audio.pingMuted ? "WaveformSlash" : "Waveform"}
				stpIconStyle={"duotone"}
				onClick={() =>
					updateAudioSettings({
						pingMuted: !settings.audio.pingMuted,
					})
				}
			/>
			<VttHudGenericButtonA
				withRoughBorderRadius
				stpIconName={
					settings.audio.chatMuted ? "ChatCircleSlash" : "ChatCircle"
				}
				stpIconStyle={"duotone"}
				onClick={() =>
					updateAudioSettings({
						chatMuted: !settings.audio.chatMuted,
					})
				}
			/>
			<VttHudGenericButtonA
				style={{ marginTop: "var(--sp-1)" }}
				stpIconName={showChat ? "ArrowSquareRight" : "ArrowSquareLeft"}
				stpIconStyle={"duotone"}
				onClick={() => {
					setShowChat((state) => !state);
				}}
			/>
		</CommunicationButtonsContainer>
	);
}
