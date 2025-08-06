import { Guid } from "../../misc";

export type CharacterData = {
	id: Guid;
	ownerId: Guid;
	raceId: Guid;
	name: string;
	level: number;
	isAlive: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	iconUrl: string;
	bannerUrl: string;
};
