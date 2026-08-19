import { GenericInfo } from "../core";
import { Guid } from "../misc";

export enum CampaignType {
	Unknown,

	OneShot,
	Short,
	Long,
	Indefinite,
}
export enum CampaignSubType {
	Unknown,
}

export type Campaign = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof CampaignType;
	subType: keyof typeof CampaignSubType;
	isListed: boolean;
	isOpen: boolean;
	maxPlayers: number;
	masterCount: number;
	playerCount: number;
	info: GenericInfo;
	createdAt: string;
	updatedAt?: string;
	albinaVersion: string;
};
