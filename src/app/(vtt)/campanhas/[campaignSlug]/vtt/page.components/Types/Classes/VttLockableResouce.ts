import { Guid } from "@/libs/stp@types";

export interface VttLockableResource {
	targetType: string;
	targetId: Guid;
	lockType: string;
	userId: Guid;
}
