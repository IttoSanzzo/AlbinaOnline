import { Guid } from "../misc";
import { LocationData } from "./location";

export type GridMap = {
	id: Guid;
	locationId?: Guid;
	name: string;
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
	tags: string[];
	imageUrl: string;
	createdAt: string;
	updatedAt: string;
	location?: LocationData;
};
