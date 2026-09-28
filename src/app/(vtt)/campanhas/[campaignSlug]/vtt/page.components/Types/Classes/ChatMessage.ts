import { Guid } from "@/libs/stp@types";

export interface VttChatMessage {
	id: Guid;
	messageToReplyId?: Guid;
	userId: Guid;
	recipients: Guid[];
	text: string;
	private: boolean;
	color1: string;
	color2: string;
	timestamp: number;
}
