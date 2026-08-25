import { GenericInfo } from "../core";
import { Guid } from "../misc";

export enum CampaignType {
	Unknown,

	Indefinite,
	Long,
	Short,
	OneShot,
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
	totalPlaytimeSeconds: number;
	info: GenericInfo;
	createdAt: string;
	updatedAt?: string;
	albinaVersion: string;
	iconUrl: string;
	bannerUrl: string;
};

export const CampaignTypeName: Record<keyof typeof CampaignType, string> = {
	Unknown: "Desconhecido",
	Indefinite: "Sem Fim",
	Long: "Longa",
	Short: "Curta",
	OneShot: "One Shot",
};
