export const VttOutputMessageTypes = [
	"MouseStates",
	"ConnectedUserIds",
	"PostPing",
	"VttSceneSnapshot",
	"VttDiceResult",
	"VttChatMessage",
] as const;
export type VttOutputMessageType = (typeof VttOutputMessageTypes)[number];
