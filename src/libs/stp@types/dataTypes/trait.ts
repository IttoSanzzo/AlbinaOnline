import {
	GenericEffect,
	GenericExtraProperty,
	GenericInfo,
	Guid,
} from "../index";

export enum TraitType {
	Unknown,
	Generic,
	Imperfection,
	Aptitude,
	Racial,
	Talent,
	Blessing,
	Unique,
}
export enum TraitSubType {
	Unknown,
	Combat,
	Magic,
	Physical,
	Sensory,
	Intellectual,
	Aspect,
	Miscellaneous,
	Special,
}

export type TraitProperties = {
	requirements: GenericExtraProperty[];
};

export type TraitData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof TraitType;
	subType: keyof typeof TraitSubType;
	iconUrl: string;
	bannerUrl: string;
	properties: TraitProperties;
	info: GenericInfo;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};

export const traitNames: Record<keyof typeof TraitType, string> = {
	Unique: "Única",
	Racial: "Racial",
	Generic: "Genérica",
	Blessing: "Benção",
	Talent: "Talento",
	Aptitude: "Aptidão",
	Imperfection: "Imperfeição",
	Unknown: "?",
};
