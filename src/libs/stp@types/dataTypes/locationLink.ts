import { Guid } from "../misc";
import { LocationData } from "./location";

export enum LocationLinkType {
	DirectDescendant,
	IndirectDescendant,
	Portal,
}
export enum LocationLinkIconType {
	Unknown,
	Auto,
	Default,

	/* World */
	Axis,

	/* Region */
	Archipelago,
	Kingdom,
	Crown,
	Province,

	/* Nature */
	Island,
	Forest,
	WhiteForest,
	Desert,
	Swamp,
	Plains,
	Mountain,
	GreenMountain,
	WhiteMountain,
	BrownMountain,
	Volcano,
	Cave,
	Lake,

	/* Settlement */
	Metropoly,
	City,
	Village,
	Farm,

	/* District */
	Military,
	Slum,
	Merchant,

	/* Structure */
	TowerFlag,
	Castle,
	Fortress,
	Outpost,
	WoodenTower,
	Guild,
	Temple,
	Store,
	Shop,
	Bank,
	Library,
	Academy,
	Inn,
	Dungeon,
	Arena,
	Mine,
	WaterMill,
	Waystation,

	/* Interior */
	Room,

	/* Landmark */
	Monument,
	Ruins,
	Well,
	Bridge,
	Portal,

	/* Other */
	Entrance,
	Exit,
	Stair,
	Secret,
	Camp,
	Quest,
	Warning,
}

export type LocationLink = {
	id: Guid;
	parentLocationId: Guid;
	childLocationId: Guid;
	type: keyof typeof LocationLinkType;
	iconType: keyof typeof LocationLinkIconType;
	displayData?: LocationLinkDisplayData;
	icon: string;
};
export type LocationLinkExpanded = LocationLink & {
	parentLocation: LocationData;
	childLocation: LocationData;
};

export type LocationLinkDisplayData = {
	x: number;
	y: number;
	rotation: number;
	opacity: number;
};
