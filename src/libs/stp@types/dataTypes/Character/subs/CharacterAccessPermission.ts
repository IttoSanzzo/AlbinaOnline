import { Guid } from "@/libs/stp@types/misc";
import { AccessLevel } from "@/libs/stp@types/otherTypes/AccessLevel";

export type CharacterAccessPermission = {
	id: Guid;
	userId: Guid;
	characterId: Guid;
	accessLevel: keyof typeof AccessLevel;
};
