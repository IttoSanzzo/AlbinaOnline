import { GenericEffect, GenericInfo } from "../index";

export type MasteryData = {
	id: number;
	slug: string;
	name: string;
	type: string;
	category: string;
	albinaVersion: string;
	iconUrl: string;
	info: GenericInfo;
	effects: GenericEffect[];
};
