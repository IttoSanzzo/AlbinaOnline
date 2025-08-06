import { Guid } from "@/libs/stp@types/misc";
import { TraitData } from "../../trait";

export type CharacterTrait = {
	id: Guid;
	characterId: Guid;
	traitId: Guid;
};
export type CharacterTraitExpanded = {
	trait: TraitData;
} & CharacterTrait;
