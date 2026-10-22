import { CreatureData, Guid, ItemData } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttGenericTransform } from "./VttGenericTransform";
import { VttLockableResource } from "./VttLockableResouce";

export interface VttToken {
	id: Guid;
	vttId: Guid;
	ownerId?: Guid;
	permitList: Guid[];
	type: keyof typeof VttTokenType;
	name?: string;
	vttTokenPlacement: VttTokenPlacement[];
	resourceLocks: VttLockableResource[];

	TargetId: Guid;
	Target: CharacterData | ItemData | CreatureData;
}

export interface VttTokenWithScenePlacement extends VttToken {
	scenePlacement: VttTokenPlacement;
}

export enum VttTokenType {
	None,
	Character,
	Creature,
	Item,
}

export interface VttTokenPlacement {
	id: Guid;
	tokenId: Guid;
	sceneId: Guid;
	coordinates: CoordinatePair;
	transform: VttGenericTransform;
	createdAt: string;
	updatedAt?: string;
	token: VttToken;
	scene: object;
}
