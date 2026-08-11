import {
	Alignment,
	GenericInfo,
	GenericSpeedStats,
	Guid,
	LanguageType,
	LifeState,
	MagicAttribute,
	MechanicalAbility,
} from "../index";
import { GenericAbilityScore } from "../otherTypes/GenericAbilityScore";

export enum CreatureType {
	Unknown,

	// From D&D
	Humanoid,
	Fiend,
	Celestial,
	Aberration,
	Beast,
	Construct,
	Dragon,
	Elemental,
	Fey,
	Giant,
	Monstrosity,
	Ooze,
	Plant,
	Undead,

	// From Albina
	Spirit,
	Divine,
	Cosmic,
}
export enum CreatureSubType {
	Unknown,
	Animal,
	Monster,
	Person,
	Vermin,
	Familiar,
	Companion,
	Guardian,
	Mount,
	Swarm,
}

export type CreatureData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof CreatureType;
	subType: keyof typeof CreatureSubType;

	magicAttributes: (keyof typeof MagicAttribute)[];
	lifeState: keyof typeof LifeState;
	alignment: Alignment;
	level: number;
	experience: number;
	isHidden: boolean;

	abilityScore: GenericAbilityScore;
	coreMetrics: CreatureCoreMetrics;
	miscMetrics: CreatureMiscMetrics;

	mechanicalAbilities: MechanicalAbility[];

	iconUrl: string;
	bannerUrl: string;
	createdAt: string;
	updatedAt?: string;
	info: GenericInfo;
	albinaVersion: string;
};

export interface CreatureCoreMetrics {
	SpeedStats: GenericSpeedStats;
	HealthPoints: number;
	ArmorClass: number;
	Initiative: number;
}

export interface CreatureMiscMetrics {
	Volume: number;
	Languages: (keyof typeof LanguageType)[];
	TestBonuses: Map<string, number>;
	Senses: Map<string, string>;
	Resistances: string[];
	Immunities: string[];
}

export const CreatureTypeName: Record<keyof typeof CreatureType, string> = {
	Unknown: "?",
	Humanoid: "Humanoide",
	Fiend: "Abissal",
	Celestial: "Celestial",
	Aberration: "Aberração",
	Beast: "Besta",
	Construct: "Constructo",
	Dragon: "Dracônico",
	Elemental: "Elemental",
	Fey: "Feérico",
	Giant: "Gigante",
	Monstrosity: "Monstruosidade",
	Ooze: "Gosmento",
	Plant: "Vegetal",
	Undead: "Não-Morto",
	Spirit: "Espiritual",
	Divine: "Divino",
	Cosmic: "Cósmico",
};
export const CreatureTypePluralName: Record<keyof typeof CreatureType, string> =
	{
		Unknown: "?",
		Humanoid: "Humanoides",
		Fiend: "Abissais",
		Celestial: "Celestiais",
		Aberration: "Aberrações",
		Beast: "Bestas",
		Construct: "Constructos",
		Dragon: "Dracônicos",
		Elemental: "Elementais",
		Fey: "Feéricos",
		Giant: "Gigantes",
		Monstrosity: "Monstruosidades",
		Ooze: "Gosmentos",
		Plant: "Vegetais",
		Undead: "Não-Mortos",
		Spirit: "Espirituais",
		Divine: "Divinos",
		Cosmic: "Cósmicos",
	};

export const CreatureSubTypeName: Record<keyof typeof CreatureSubType, string> =
	{
		Unknown: "?",
		Animal: "Animal",
		Monster: "Monstro",
		Person: "Pessoa",
		Vermin: "Verme",
		Familiar: "Familiar",
		Companion: "Companheiro",
		Guardian: "Guardião",
		Mount: "Montaria",
		Swarm: "Enxame",
	};
