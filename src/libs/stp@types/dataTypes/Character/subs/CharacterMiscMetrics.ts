import { MagicAttribute } from "@/libs/stp@types/otherTypes";

export type CharacterMiscMetrics = {
	characterId: string;
	magicAttributes: (keyof typeof MagicAttribute)[];
	spokenLanguages: string[];
	carryCapacity: number;
	carriedWeight: number;
	resistances: string[];
	weaknesses: string[];
	immunities: string[];
};
