import { Guid } from "@/libs/stp@types";

export interface VttResourceLockDto {
	targetType: string;
	targetId: Guid;
	lockType: string;
	userId: Guid;
}
