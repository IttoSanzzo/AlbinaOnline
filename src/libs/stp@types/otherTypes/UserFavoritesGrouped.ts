import { CharacterData } from "../dataTypes/Character";
import { ItemData } from "../dataTypes/item";
import { MasteryData } from "../dataTypes/mastery";
import { RaceData } from "../dataTypes/race";
import { SkillData } from "../dataTypes/skill";
import { SpellData } from "../dataTypes/spell";
import { TraitData } from "../dataTypes/trait";

export type UserFavoriteType =
	| "Character"
	| "Item"
	| "Mastery"
	| "Skill"
	| "Spell"
	| "Trait"
	| "Race";

type FavoriteCharacter = {
	id: string;
	order: number;
	type: string;
	target: CharacterData;
};
type FavoriteItem = {
	id: string;
	order: number;
	type: string;
	target: ItemData;
};
type FavoriteMastery = {
	id: string;
	order: number;
	type: string;
	target: MasteryData;
};
type FavoriteSkill = {
	id: string;
	order: number;
	type: string;
	target: SkillData;
};
type FavoriteSpell = {
	id: string;
	order: number;
	type: string;
	target: SpellData;
};
type FavoriteTrait = {
	id: string;
	order: number;
	type: string;
	target: TraitData;
};
type FavoriteRace = {
	id: string;
	order: number;
	type: string;
	target: RaceData;
};

export type UserFavoritesGrouped = {
	character: FavoriteCharacter[];
	item: FavoriteItem[];
	mastery: FavoriteMastery[];
	skill: FavoriteSkill[];
	spell: FavoriteSpell[];
	trait: FavoriteTrait[];
	race: FavoriteRace[];
};
