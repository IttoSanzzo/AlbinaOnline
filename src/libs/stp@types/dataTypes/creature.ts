import { GenericInfo, Guid } from "../index";

export enum CreatureType {
	Unknown,
}
export enum CreatureSubType {
	Unknown,
}

export type CreatureData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof CreatureType;
	subType: keyof typeof CreatureSubType;
	info: GenericInfo;
	isHidden: boolean;
	iconUrl: string;
	bannerUrl: string;
	createdAt: string;
	updatedAt?: string;
	albinaVersion: string;
};

export const CreatureTypeName: Record<keyof typeof CreatureType, string> = {
	Unknown: "?",
};
export const CreatureTypePluralName: Record<keyof typeof CreatureType, string> =
	{
		Unknown: "?",
	};

export const CreatureSubTypeName: Record<keyof typeof CreatureSubType, string> =
	{
		Unknown: "?",
	};
