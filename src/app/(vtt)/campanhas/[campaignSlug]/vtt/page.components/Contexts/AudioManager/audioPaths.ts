import { PING_SOUNDS } from "../../VttCore/Other/PingEngine/PingRadialWheelTypes";

export const audioPaths = {
	vtt: {
		chat: {
			NewMessage: "/sounds/vtt/chat/new_message.mp3",
		},
		pings: PING_SOUNDS,
		playerEvents: {
			Connect: "/sounds/vtt/player-events/connected.mp3",
			PlayerConnected: "/sounds/vtt/player-events/joining.mp3",
			PlayerDisconnected: "/sounds/vtt/player-events/disconnected.mp3",
		},
	},
} as const;
