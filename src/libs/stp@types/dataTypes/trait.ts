export enum TraitType {
	Unknown,
	Generic,
	Racial,
	Talent,
	Blessing,
	Unique,
}
export enum TraitSubType {
	Unknown,
}

import { GenericEffect, Guid } from "../index";

export type TraitInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
	requirements: string[];
};

export type TraitData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof TraitType;
	subType: keyof typeof TraitSubType;
	iconUrl: string;
	bannerUrl: string;
	info: TraitInfo;
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
	Unknown: "?",
};
