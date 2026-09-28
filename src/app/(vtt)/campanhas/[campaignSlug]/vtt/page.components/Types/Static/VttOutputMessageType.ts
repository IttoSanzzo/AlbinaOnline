export const VttOutputMessageTypes = [
	"MouseStates",
	"ConnectedUserIds",
	"PostPing",
	"VttSceneSnapshot",
	"VttDiceResult",
	"VttChatMessage",
	"VttAllChatMessages",
	"VttAllDiceResults",
	"VttDeleteChatMessage",
] as const;
export type VttOutputMessageType = (typeof VttOutputMessageTypes)[number];
