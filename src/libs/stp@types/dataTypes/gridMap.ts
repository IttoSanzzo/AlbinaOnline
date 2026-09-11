import { Guid } from "../misc";
import { LocationData } from "./location";

export type GridMap = {
	id: Guid;
	locationId?: Guid;
	name: string;
	Width: number;
	Height: number;
	OffsetX: number;
	OffsetY: number;
	tags: string[];
	imageUrl: string;
	createdAt: string;
	updatedAt: string;
	location?: LocationData;
};
