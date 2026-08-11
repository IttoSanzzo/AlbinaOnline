import { GenericInfo, Guid } from "../index";

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
	info: GenericInfo;
	isHidden: boolean;
	iconUrl: string;
	bannerUrl: string;
	createdAt: string;
	updatedAt?: string;
	albinaVersion: string;
};

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
