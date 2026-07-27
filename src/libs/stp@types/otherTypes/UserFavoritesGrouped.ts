import { CharacterData } from "../dataTypes/Character";
import { ItemData } from "../dataTypes/item";
import { LocationData } from "../dataTypes/location";
import { MasteryData } from "../dataTypes/mastery";
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
	| "Location"
	| "Race";

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
type FavoriteLocation = {
	id: Guid;
	order: number;
	type: string;
	target: LocationData;
};
type FavoriteRace = {
	id: Guid;
	order: number;
	type: string;
	target: RaceData;
};
type FavoriteCharacter = {
	id: Guid;
	order: number;
	type: string;
	target: CharacterData;
};

export type UserFavoritesGrouped = {
	item: FavoriteItem[];
	mastery: FavoriteMastery[];
	skill: FavoriteSkill[];
	spell: FavoriteSpell[];
	trait: FavoriteTrait[];
	location: FavoriteLocation[];
	race: FavoriteRace[];
	character: FavoriteCharacter[];
};
