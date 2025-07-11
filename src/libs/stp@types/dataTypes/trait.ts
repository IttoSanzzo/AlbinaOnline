import { GenericEffect, GenericExtraProperty, GenericInfo } from "../index";

export type TraitInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
	requirements: string[];
};

export type TraitData = {
	id: string;
	slug: string;
	name: string;
	type: string;
	subType: string;
	iconUrl: string;
	bannerUrl: string;
	info: TraitInfo;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};
