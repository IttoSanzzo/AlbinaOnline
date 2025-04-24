import { GenericEffect, GenericInfo } from "../index";

export type ItemData = {
	id: number;
	slug: string;
	name: string;
	type: string;
	subType: string;
	albinaVersion: string;
	iconUrl: string;
	info: GenericInfo;
	effects: GenericEffect[];
};
