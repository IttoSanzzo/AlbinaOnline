import { GenericEffect, GenericExtraProperty, GenericInfo } from "../index";

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
	id: string;
	slug: string;
	name: string;
	type: string;
	subType: string;
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	properties?: SkillProperties;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};
