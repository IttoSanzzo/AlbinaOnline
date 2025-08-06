import { GenericEffect, GenericInfo, Guid } from "../index";

export enum MasteryType {
	Unknown,
	Proficiency,
	Expertise,
	Knowledge,
	Craft,
}
export enum MasterySubType {
	Unknown,
	Strength,
	Agility,
	Technique,
	Constitution,
	Intelligence,
	Wisdom,
	Charisma,
	Singular,
	Multiple,
	Combatant,
	Production,
	General,
	Armed,
	Focus,
	Armored,
	CombatStyle,
	Tool,
}

export type MasteryData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof MasteryType;
	subType: keyof typeof MasterySubType;
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};

export const masteryNames: Record<keyof typeof MasteryType, string> = {
	Proficiency: "Proficiência",
	Craft: "Ofício",
	Expertise: "Perícia",
	Knowledge: "Conhecimento",
	Unknown: "?",
};
