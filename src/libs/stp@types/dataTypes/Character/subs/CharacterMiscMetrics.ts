import { Guid } from "@/libs/stp@types/misc";
import { LanguageType, MagicAttribute } from "@/libs/stp@types/otherTypes";

export type CharacterMiscMetrics = {
	characterId: Guid;
	magicAttributes: (keyof typeof MagicAttribute)[];
	spokenLanguages: (keyof typeof LanguageType)[];
	carryCapacity: number;
	resistances: string[];
	weaknesses: string[];
	immunities: string[];
};
