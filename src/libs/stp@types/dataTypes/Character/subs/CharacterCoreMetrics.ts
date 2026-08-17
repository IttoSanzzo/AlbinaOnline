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
	walk: number;
	combat: number;
	swim?: number;
	fly?: number;
	burrow?: number;
	climb?: number;
};

export type CharacterCoreMetrics = {
	characterId: Guid;
	healthPoints: Gauge;
	staminaPoints: Gauge;
	manaPoints: Gauge;
	speedStats: SpeedStats;
	armorClass: number;
	initiative: number;
	notes: string;
};
