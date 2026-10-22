export const VttOutputMessageTypes = [
	// Miscs /////////////////////////////////////////////////////////////////////
	"MouseStates",
	"ConnectedUserIds",
	"PostPing",
	"VttSceneSnapshot",
	"VttDiceResult",
	"VttChatMessage",
	"VttAllChatMessages",
	"VttAllDiceResults",
	"VttDeleteChatMessage",

	// Vtt Snapshot //////////////////////////////////////////////////////////////
	"VttCompleteSceneSnapshot",

	// VttGridMap ////////////////////////////////////////////////////////////////
	"VttGridMapAdded",
	"VttGridMapUpdated",
	"VttGridMapRemoved",
	"VttGridMapDragStarted",
	"VttGridMapDragUpdate",
	"VttGridMapDragEnded",
	"VttGridMapDragCanceled",

	// VttToken //////////////////////////////////////////////////////////////////
	"VttTokenAdded",
	"VttTokenUpdated",
	"VttTokenRemoved",
	"VttTokenDragStarted",
	"VttTokenDragUpdate",
	"VttTokenDragEnded",
	"VttTokenDragCanceled",
] as const;
export type VttOutputMessageType = (typeof VttOutputMessageTypes)[number];
