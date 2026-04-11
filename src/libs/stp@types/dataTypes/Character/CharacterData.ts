import { Guid } from "../../misc";

export type CharacterData = {
	id: Guid;
	ownerId: Guid;
	raceId: Guid;
	name: string;
	gender: number;
	level: number;
	isAlive: boolean;
	isActive: boolean;
	isPublic: boolean;
	isNpc: boolean;
	createdAt: string;
	updatedAt: string;
	iconUrl: string;
	bannerUrl: string;
};
