import { Guid } from "../misc";
import { RoleHierarchy } from "./RoleHierarchy";

export type FullUser = {
	id: Guid;
	username: string;
	nickname: string;
	role: keyof typeof RoleHierarchy;
	iconUrl: string;
	bannerUrl: string;
	createdAt: string;
	updatedAt: string;
};
