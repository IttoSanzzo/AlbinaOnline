import { GenericEffect, GenericInfo } from "../index";

type ItemExtraProperty = [string, string];

export type ItemProperties = {
	slot: string;
	attribute: string;
	equipmentStats?: {
		damage: string;
		accuracy: string;
		defense: string;
		damageType: string;
		range: string;
	};
	extras: ItemExtraProperty[];
};

export type ItemData = {
	id: number;
	slug: string;
	name: string;
	type: string;
	subType: string;
	albinaVersion: string;
	iconUrl: string;
	info: GenericInfo;
	properties?: ItemProperties;
	effects: GenericEffect[];
};
