import { Guid } from "@/libs/stp@types";
import { VttInputMessageType } from "./Static/VttInputMessageType";

export interface VttInputMessage {
	id: Guid;
	type: VttInputMessageType;
	data: object;
}
