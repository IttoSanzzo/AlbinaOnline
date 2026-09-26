import { Guid } from "@/libs/stp@types";
import { VttOutputMessageType } from "./Static/VttOutputMessageType";

export interface VttOutputMessage {
	id: Guid;
	type: VttOutputMessageType;
	data: object;
	userId?: Guid;
	timestamp?: number;
}
