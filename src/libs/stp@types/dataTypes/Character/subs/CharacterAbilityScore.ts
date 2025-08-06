import { Guid } from "@/libs/stp@types/misc";

export type CharacterAbilityScore = {
	characterId: Guid;
	strength: number;
	agility: number;
	technique: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
};
