import { StandartTextColor } from "@/components/(UIBasics)";
import { Guid } from "./misc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LintIgnoredAny = any;

export type GenericInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
};

export type GenericEffectContent = {
	type: string;
	color?: keyof typeof StandartTextColor;
	value: string;
	tableData?: [];
};

export type GenericEffect = {
	id: Guid;
	effectLinkId: Guid;
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

export type SearchEntryEntity =
	| "Character"
	| "Item"
	| "Mastery"
	| "Skill"
	| "Spell"
	| "Trait"
	| "Race"
	| "User";
export type SearchEntry = {
	entity: SearchEntryEntity;
	id: Guid;
	slug: string;
	title: string;
	type: string;
	subType: string;
	iconUrl: string;
	bannerUrl: string;
};
export type AllSearchEntriesByType = {
	character: SearchEntry[];
	item: SearchEntry[];
	mastery: SearchEntry[];
	skill: SearchEntry[];
	spell: SearchEntry[];
	trait: SearchEntry[];
	race: SearchEntry[];
	user: SearchEntry[];
};
