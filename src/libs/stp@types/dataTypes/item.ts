import { GenericEffect, GenericExtraProperty, GenericInfo } from "../index";

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
	extras: GenericExtraProperty[];
};

export type ItemData = {
	id: string;
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
