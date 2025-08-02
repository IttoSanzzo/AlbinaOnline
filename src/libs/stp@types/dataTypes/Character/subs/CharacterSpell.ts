import { SpellData } from "../../spell";

export type CharacterSpell = {
	id: string;
	characterId: string;
	spellId: string;
};
export type CharacterSpellExpanded = {
	spell: SpellData;
} & CharacterSpell;
