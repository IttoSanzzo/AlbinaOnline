import {
	GenericEffect,
	GenericExtraProperty,
	GenericInfo,
	SpellDomain,
} from "../index";

export enum SpellType {
	Unknown,
}
export enum SpellSubType {
	Unknown,
}

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
	id: string;
	slug: string;
	name: string;
	type: keyof typeof SpellType;
	subType: keyof typeof SpellSubType;
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	properties?: SpellProperties;
	domainLevel: number;
	spellDomains: (keyof typeof SpellDomain)[];
	magicAttributes: string[];
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};
