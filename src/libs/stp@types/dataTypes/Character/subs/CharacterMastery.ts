import { MasteryData } from "../../mastery";

export type CharacterMastery = {
	id: string;
	characterId: string;
	masteryId: string;
	level: number;
};

export type CharacterMasteryExpanded = {
	mastery: MasteryData;
} & CharacterMastery;
