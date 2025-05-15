import { GenericEffect, GenericInfo } from "../index";

export type MasteryData = {
	id: string;
	slug: string;
	name: string;
	type: string;
	subType: string;
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};
