import { GenericEffect, GenericInfo } from "../index";

type ItemExtraProperty = {
	key: string;
	value: string;
};

export type ItemProperties = {
	slot: string;
	attribute: string;
	stats?: {
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
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	properties?: ItemProperties;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};
