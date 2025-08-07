import { Guid, LanguageType, Parameters } from "../index";

export type RaceInfo = {
	introduction: string[];
	personality: string[];
	culture: string[];
	miscellaneous: string[];
	groups: string[];
	relations: string[];
	description: string[];
	images: string[];
};

export type RaceGenerals = {
	height: string;
	weight: string;
	longevity: string;
	speed: string;
	language: keyof typeof LanguageType;
};

export type RaceParameters = Parameters;

export type RaceData = {
	id: Guid;
	slug: string;
	name: string;
	type: string;
	subType: string;
	iconUrl: string;
	bannerUrl: string;
	info: RaceInfo;
	parameters: RaceParameters;
	generals: RaceGenerals;
	traitSlugs: string[];
	skillSlugs: string[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};
