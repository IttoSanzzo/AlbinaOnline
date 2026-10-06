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
	"VttCompleteSceneSnapshot",
	"VttGridMapAdded",
	"VttGridMapUpdated",
	"VttGridMapRemoved",
] as const;
export type VttOutputMessageType = (typeof VttOutputMessageTypes)[number];
