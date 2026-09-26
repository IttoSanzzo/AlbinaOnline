export const VttInputMessageTypes = [
	"PostMouseState",
	"PostPing",
	"PutActiveSceneId",
	"PostChatMessage",
] as const;
export type VttInputMessageType = (typeof VttInputMessageTypes)[number];
