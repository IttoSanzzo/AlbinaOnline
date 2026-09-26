import { Guid } from "@/libs/stp@types";

export interface VttChatMessage {
	userId: Guid;
	recipients: Set<Guid>;
	text: string;
	private: boolean;
	color1: string;
	color2: string;
	timestamp: number;
}
