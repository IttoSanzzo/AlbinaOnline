import { Guid } from "@/libs/stp@types/misc";
import { MasteryData } from "../../mastery";

export type CharacterMastery = {
	id: Guid;
	characterId: Guid;
	masteryId: Guid;
	level: number;
	notes: string;
};

export type CharacterMasteryExpanded = {
	mastery: MasteryData;
} & CharacterMastery;
