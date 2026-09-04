import { Guid } from "@/libs/stp@types";

export interface VttOutputMessage {
	id: Guid;
	type: string;
	data: object;
}
