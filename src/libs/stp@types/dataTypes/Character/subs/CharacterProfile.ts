import { Guid } from "@/libs/stp@types/misc";

export type CharacterProfile = {
	characterId: Guid;
	age: number;
	stature: number;
	weight: number;
	appearanceDescription: string;
	personalityTraces: string;
	ideals: string;
	bonds: string;
	summary: string;
	backgroundHistory: string;
	images: string[];
	tags: string[];
};
