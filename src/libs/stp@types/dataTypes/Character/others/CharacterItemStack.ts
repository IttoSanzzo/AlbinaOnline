import { Guid } from "@/libs/stp@types/misc";
import { ItemData } from "../../item";

export type CharacterItemStack = {
	id: Guid;
	characterId: Guid;
	type: "Character";
	amount: number;
	itemId: Guid;
};
export type CharacterItemStackExpanded = {
	item: ItemData;
} & CharacterItemStack;
