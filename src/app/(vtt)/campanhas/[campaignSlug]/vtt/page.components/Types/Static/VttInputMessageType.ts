export const VttInputMessageTypes = [
	"PostMouseState",
	"PostPing",
	"PutActiveSceneId",
	"PostChatMessage",
	"RequestChatMessages",
	"DeleteChatMessage",
	"RequestDiceResults",
] as const;
export type VttInputMessageType = (typeof VttInputMessageTypes)[number];
