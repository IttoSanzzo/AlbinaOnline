import { Guid } from "@/libs/stp@types";

export interface VttInputMessage {
	id: Guid;
	type: string;
	data: object;
}
