import { StandartTextColor } from "@/components/(UIBasics)";

export type GenericInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
};

export type GenericEffectContent = {
	type: string;
	color?: keyof typeof StandartTextColor;
	value: string;
};

export type GenericEffect = {
	id: number;
	role: string;
	name?: string;
	color?: keyof typeof StandartTextColor;
	order: number;
	contents: GenericEffectContent[];
};

export type Parameters = {
	vitality: number;
	vigor: number;
	manapool: number;
	physicalPower: number;
	magicalPower: number;
};
export type DefensiveProfile = {
	resistences: string[];
	weaknesses: string[];
	immunities: string[];
};
export type GenericExtraProperty = {
	key: string;
	value: string;
};
