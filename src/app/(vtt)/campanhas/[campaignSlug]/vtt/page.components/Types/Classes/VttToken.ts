import { CreatureData, Guid, ItemData } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttGenericTransform } from "./VttGenericTransform";
import { VttLockableResource } from "./VttLockableResouce";

export interface RawVttToken {
	id: Guid;
	vttId: Guid;
	ownerId?: Guid;
	permitList: Guid[];
	type: keyof typeof VttTokenType;
	name?: string;
	placements: VttTokenPlacement[];
	resourceLocks: VttLockableResource[];
	createdAt: string;
	updatedAt?: string;

	TargetId: Guid;
	Target: CharacterData | ItemData | CreatureData;
}

export interface VttToken {
	id: Guid;
	vttId: Guid;
	ownerId?: Guid;
	permitList: Guid[];
	type: keyof typeof VttTokenType;
	name?: string;
	placements: Map<Guid, VttTokenPlacement>;
	resourceLocks: VttLockableResource[];
	createdAt: string;
	updatedAt?: string;

	TargetId: Guid;
	Target: CharacterData | ItemData | CreatureData;
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

export function vttTokenCanBeOperatedBy(
	vttToken: VttToken,
	userId: Guid | null = null,
	isMaster: boolean = false,
) {
	if (isMaster || (vttToken.ownerId && vttToken.ownerId === userId))
		return true;
	if (!userId) return false;
	return vttToken.permitList.includes(userId);
}
