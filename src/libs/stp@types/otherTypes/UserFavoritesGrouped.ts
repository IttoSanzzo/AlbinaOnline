import { CharacterData } from "../dataTypes/Character";
import { CreatureData } from "../dataTypes/creature";
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
	| "Creature"
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
type FavoriteRace = {
	id: Guid;
	order: number;
	type: string;
	target: RaceData;
};
type FavoriteCreature = {
	id: Guid;
	order: number;
	type: string;
	target: CreatureData;
};
type FavoriteLocation = {
	id: Guid;
	order: number;
	type: string;
	target: LocationData;
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
	race: FavoriteRace[];
	creature: FavoriteCreature[];
	location: FavoriteLocation[];
	character: FavoriteCharacter[];
};
