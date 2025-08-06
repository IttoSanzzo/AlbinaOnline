import { Guid } from "../misc";

export type FullUser = {
	id: Guid;
	username: string;
	nickname: string;
	iconUrl: string;
	bannerUrl: string;
	createdAt: string;
	updatedAt: string;
};
