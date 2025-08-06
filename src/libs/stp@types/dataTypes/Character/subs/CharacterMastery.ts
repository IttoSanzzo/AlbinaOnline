import { Guid } from "@/libs/stp@types/misc";
import { MasteryData } from "../../mastery";

export type CharacterMastery = {
	id: Guid;
	characterId: Guid;
	masteryId: Guid;
	level: number;
};

export type CharacterMasteryExpanded = {
	mastery: MasteryData;
} & CharacterMastery;
