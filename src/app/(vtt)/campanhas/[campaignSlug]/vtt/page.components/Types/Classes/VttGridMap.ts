import { Guid } from "@/libs/stp@types";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttGenericTransform } from "./VttGenericTransform";
import { VttLockableResource } from "./VttLockableResouce";

export interface VttGridMap {
	id: Guid;
	sceneId: Guid;
	gridMapId: Guid;
	coordinates: CoordinatePair;
	transform: VttGenericTransform;
	createdAt: string;
	updatedAt?: string;
	// scene: Scene;
	gridMap: GridMap;
	resourceLocks: VttLockableResource[];
}
