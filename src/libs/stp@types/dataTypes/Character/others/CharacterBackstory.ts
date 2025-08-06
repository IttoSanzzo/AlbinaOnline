import { Guid } from "@/libs/stp@types/misc";

export type CharacterBackstory = {
	id: Guid;
	characterId: Guid;
	type: string;
	history: string;
};
