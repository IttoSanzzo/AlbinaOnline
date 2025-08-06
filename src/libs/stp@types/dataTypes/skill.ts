import {
	GenericEffect,
	GenericExtraProperty,
	GenericInfo,
	Guid,
} from "../index";

export enum SkillType {
	Unknown,
	Unique,
	Racial,
	Common,
	Generic,
}
export enum SkillSubType {
	Unknown,
	MajorAction,
	MinorAction,
	MajorReaction,
	MinorReaction,
}

export type SkillComponents = {
	mana: string;
	stamina: string;
	time: string;
	duration: string;
	form: string;
	range: string;
	area: string;
};

export type SkillProperties = {
	components: SkillComponents;
	extras: GenericExtraProperty[];
};

export type SkillData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof SkillType;
	subType: keyof typeof SkillSubType;
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	properties?: SkillProperties;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};

export const skillNames: Record<keyof typeof SkillType, string> = {
	Unique: "Única",
	Racial: "Racial",
	Common: "Comum",
	Generic: "Genérica",
	Unknown: "?",
};
