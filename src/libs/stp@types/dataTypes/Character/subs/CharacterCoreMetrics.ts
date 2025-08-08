import { Guid } from "@/libs/stp@types";

export type Gauge = {
	baseMax: number;
	baseCurrent: number;
	temporaryMaxModifier: number;
	temporaryCurrentModifier: number;
	effectiveMax: number;
	effectiveCurrent: number;
};
export type SpeedStats = {
	walkSpeed: number;
	combatSpeed: number;
	swimSpeed: number;
	flySpeed: number;
};

export type CharacterCoreMetrics = {
	characterId: Guid;
	healthPoints: Gauge;
	staminaPoints: Gauge;
	manaPoints: Gauge;
	speedStats: SpeedStats;
	armorClass: number;
	initiative: number;
};
