import { Guid } from "@/libs/stp@types/misc";
import { SpellData } from "../../spell";

export type CharacterSpell = {
	id: Guid;
	characterId: Guid;
	spellId: Guid;
};
export type CharacterSpellExpanded = {
	spell: SpellData;
} & CharacterSpell;
