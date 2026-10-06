import { Guid } from "@/libs/stp@types";
import { VttOperationMethod } from "./Static/VttOperationMethod";

export interface VttInputMessage {
	id: Guid;
	method: VttOperationMethod;
	path: string;
	data: object;
}
