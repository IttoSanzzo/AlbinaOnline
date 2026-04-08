import { CharacterData } from "../dataTypes/Character";
import { ItemData } from "../dataTypes/item";
import { MasteryData } from "../dataTypes/mastery";
import { NpcData } from "../dataTypes/Npc";
import { RaceData } from "../dataTypes/race";
import { SkillData } from "../dataTypes/skill";
import { SpellData } from "../dataTypes/spell";
import { TraitData } from "../dataTypes/trait";
import { Guid } from "../misc";

export type UserFavoriteType =
	| "Character"
	| "Item"
	| "Mastery"
	| "Skill"
	| "Spell"
	| "Trait"
	| "Race"
	| "Npc";

type FavoriteCharacter = {
	id: Guid;
	order: number;
	type: string;
	target: CharacterData;
};
type FavoriteItem = {
	id: Guid;
	order: number;
	type: string;
	target: ItemData;
};
type FavoriteMastery = {
	id: Guid;
	order: number;
	type: string;
	target: MasteryData;
};
type FavoriteSkill = {
	id: Guid;
	order: number;
	type: string;
	target: SkillData;
};
type FavoriteSpell = {
	id: Guid;
	order: number;
	type: string;
	target: SpellData;
};
type FavoriteTrait = {
	id: Guid;
	order: number;
	type: string;
	target: TraitData;
};
type FavoriteRace = {
	id: Guid;
	order: number;
	type: string;
	target: RaceData;
};
type FavoriteNpc = {
	id: Guid;
	order: number;
	type: string;
	target: NpcData;
};

export type UserFavoritesGrouped = {
	character: FavoriteCharacter[];
	item: FavoriteItem[];
	mastery: FavoriteMastery[];
	skill: FavoriteSkill[];
	spell: FavoriteSpell[];
	trait: FavoriteTrait[];
	race: FavoriteRace[];
	npc: FavoriteNpc[];
};
