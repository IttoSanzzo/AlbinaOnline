import { GenericEffect, GenericExtraProperty, GenericInfo } from "../index";

export type SpellComponents = {
	mana: string;
	stamina: string;
	time: string;
	duration: string;
	form: string;
	range: string;
	area: string;
};

export type SpellProperties = {
	components: SpellComponents;
	extras: GenericExtraProperty[];
	chants: string[];
};

export type SpellData = {
	id: number;
	slug: string;
	name: string;
	type: string;
	subType: string;
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	properties?: SpellProperties;
	domainLevel: number;
	spellDomains: string[];
	magicAttributes: string[];
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};
