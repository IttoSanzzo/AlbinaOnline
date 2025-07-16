import { AccessLevel } from "@/libs/stp@types/otherTypes/AccessLevel";

export type CharacterAccessPermission = {
	id: string;
	userId: string;
	characterId: string;
	accessLevel: keyof typeof AccessLevel;
};
