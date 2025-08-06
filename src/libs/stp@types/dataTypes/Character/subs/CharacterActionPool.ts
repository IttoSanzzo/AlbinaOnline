import { Guid } from "@/libs/stp@types/misc";

export type CharacterActionPool = {
	characterId: Guid;
	normalActions: number;
	bonusActions: number;
	cunningActions: number;
	magicActions: number;
	specialActions: number;
};
