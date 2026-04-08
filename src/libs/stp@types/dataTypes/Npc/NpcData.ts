import { Guid } from "../../misc";

export type NpcData = {
	id: Guid;
	ownerId: Guid;
	raceId: Guid;
	name: string;
	level: number;
	isAlive: boolean;
	isActive: boolean;
	isPublic: boolean;
	gender: number;
	createdAt: string;
	updatedAt: string;
	iconUrl: string;
	bannerUrl: string;
};
