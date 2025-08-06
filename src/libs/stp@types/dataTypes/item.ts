import {
	GenericEffect,
	GenericExtraProperty,
	GenericInfo,
	Guid,
} from "../index";

export enum ItemType {
	Unknown,
	Armament,
	Focus,
	Shielding,
	Frame,
	Wearable,
	Accessory,
	Consumable,
	Special,
	Miscellaneous,
}
export enum ItemSubType {
	Unknown,
	Grimoire,
	Staff,
	Scepter,
	Wand,
	Orb,
	ShortBlade,
	Sword,
	Axe,
	Bow,
	Crossbow,
	Polearm,
	ConcussiveWeapon,
	FireWeapon,
	TetheredWeapon,
	BluntWeapon,
	LightShield,
	MediumShield,
	HeavyShield,
	LightFrame,
	MediumFrame,
	HeavyFrame,
	Relic,
}

export type ItemProperties = {
	slot: string;
	weight: number;
	attribute: string;
	stats?: {
		damage: string;
		accuracy: string;
		defense: string;
		damageType: string;
		range: string;
	};
	extras: GenericExtraProperty[];
};

export type ItemData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof ItemType;
	subType: keyof typeof ItemSubType;
	iconUrl: string;
	bannerUrl: string;
	info: GenericInfo;
	properties: ItemProperties;
	effects: GenericEffect[];
	createdAt: string;
	updatedAt: string;
	albinaVersion: string;
};

export const ItemTypeName: Record<keyof typeof ItemType, string> = {
	Armament: "Armamento",
	Focus: "Foco",
	Shielding: "Escudo",
	Frame: "Frame",
	Wearable: "Vestimenta",
	Accessory: "Acessório",
	Consumable: "Consumível",
	Special: "Especial",
	Miscellaneous: "Miscelâneo",
	Unknown: "?",
};
export const ItemTypePluralName: Record<keyof typeof ItemType, string> = {
	Armament: "Armamentos",
	Focus: "Focos",
	Shielding: "Escudos",
	Frame: "Frames",
	Wearable: "Vestimentas",
	Accessory: "Acessórios",
	Consumable: "Consumíveis",
	Special: "Especiais",
	Miscellaneous: "Miscelâneos",
	Unknown: "?",
};
