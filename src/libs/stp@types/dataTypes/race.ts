import { NotionTextColor } from "@/components/(NotionBased)";
import { DefensiveProfile, GenericEffectContent, Parameters } from "../index";

export type RacialTrait = {
	id: number;
	role: string;
	title?: string;
	titleColor?: keyof typeof NotionTextColor;
	contents: GenericEffectContent[];
};
export type RacialSkill = {
	id: number;
	role: string;
	title?: string;
	titleColor?: keyof typeof NotionTextColor;
	contents: GenericEffectContent[];
};

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
	language: string;
};

export type RaceData = {
	id: number;
	slug: string;
	name: string;
	type: string;
	subType: string;
	albinaVersion: string;
	iconUrl: string;
	bannerUrl: string;
	info: RaceInfo;
	parameters: Parameters;
	generals: RaceGenerals;
	racialTraits: RacialTrait[];
	racialSkills: RacialSkill[];
	defensiveProfile: DefensiveProfile;
};
