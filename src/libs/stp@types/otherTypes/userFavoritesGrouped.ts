import { ItemData } from "../dataTypes/item";
import { MasteryData } from "../dataTypes/mastery";
import { RaceData } from "../dataTypes/race";
import { SkillData } from "../dataTypes/skill";
import { SpellData } from "../dataTypes/spell";
import { TraitData } from "../dataTypes/trait";

type favoriteItem = {
	id: string;
	displayOrder: number;
	type: string;
	target: ItemData;
};
type favoriteMastery = {
	id: string;
	displayOrder: number;
	type: string;
	target: MasteryData;
};
type favoriteSkill = {
	id: string;
	displayOrder: number;
	type: string;
	target: SkillData;
};
type favoriteSpell = {
	id: string;
	displayOrder: number;
	type: string;
	target: SpellData;
};
type favoriteTrait = {
	id: string;
	displayOrder: number;
	type: string;
	target: TraitData;
};
type favoriteRace = {
	id: string;
	displayOrder: number;
	type: string;
	target: RaceData;
};

export type userFavoritesGrouped = {
	Character: favoriteItem[];
	Item: favoriteItem[];
	Mastery: favoriteMastery[];
	Skill: favoriteSkill[];
	Spell: favoriteSpell[];
	Trait: favoriteTrait[];
	Race: favoriteRace[];
};
