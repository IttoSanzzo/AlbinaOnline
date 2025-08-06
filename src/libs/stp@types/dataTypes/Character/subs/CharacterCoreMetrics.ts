import { Guid } from "@/libs/stp@types/misc";

export type CharacterCoreMetrics = {
	characterId: Guid;
	maxHp: number;
	maxEp: number;
	maxMp: number;
	currentHp: number;
	currentEp: number;
	currentMp: number;
	movementSpeed: number;
	flySpeed: number;
	swimSpeed: number;
	armorClass: number;
	initiative: number;
};
