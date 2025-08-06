import { Guid } from "@/libs/stp@types/misc";
import { MagicAttribute } from "@/libs/stp@types/otherTypes";

export type CharacterMiscMetrics = {
	characterId: Guid;
	magicAttributes: (keyof typeof MagicAttribute)[];
	spokenLanguages: string[];
	carryCapacity: number;
	carriedWeight: number;
	resistances: string[];
	weaknesses: string[];
	immunities: string[];
};
