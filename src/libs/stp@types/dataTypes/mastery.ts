import { GenericEffect, GenericInfo } from "../index";

export enum MasteryType {
	Unknown,
	Expertise,
	Proficiency,
	Knowledge,
	Craft,
}
export enum MasterySubType {
	Unknown,
	Agility,
	Intelligence,
	Strength,
	Constitution,
	Technique,
	Charisma,
	Wisdom,
	Singular,
	Multiple,
	General,
	Fighter,
	Production,
	Combatant,
	Armed,
	Armored,
	Navy,
	Defensive,
	Focus,
	CombatStyle,
	Tool,
}

export type MasteryData = {
	id: string;
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
