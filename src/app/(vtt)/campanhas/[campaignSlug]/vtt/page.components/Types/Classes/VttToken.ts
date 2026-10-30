import { CreatureData, Guid, ItemData } from "@/libs/stp@types";
import { VttLockableResource } from "./VttLockableResouce";
import { VttGenericTransform } from "./VttGenericTransform";

export enum VttTokenType {
	None,
	Character,
	Creature,
	Item,
}

export interface RawVttToken {
	id: Guid;
	vttId: Guid;
	ownerId?: Guid;
	permitList: Guid[];
	type: keyof typeof VttTokenType;
	name?: string;
	appearance: VttTokenAppearance;
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

export enum VttTokenAppearanceImageFit {
	Cover,
	Contain,
	Fill,
}

export enum VttTokenChipType {
	Freeform,
	FramedCircle,
	UnframedCircle,
	FramedRectangular,
	UnframedRectangular,
}

export interface VttTokenAppearance extends VttGenericTransform {
	width: number;
	height: number;
	imageFitMode: keyof typeof VttTokenAppearanceImageFit;
	hideImageOverflow: boolean;
	chipType: keyof typeof VttTokenChipType;
}

export interface VttTokenPlacement {
	id: Guid;
	tokenId: Guid;
	sceneId: Guid;
	x: number;
	y: number;
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
