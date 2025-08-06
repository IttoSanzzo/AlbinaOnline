import { Guid } from "@/libs/stp@types/misc";

export type CharacterParameters = {
	characterId: Guid;
	vitality: number;
	vigor: number;
	mana: number;
	physicalMight: number;
	arcanePower: number;
};
