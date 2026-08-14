import { StandartTextColor } from "@/components/(UIBasics)";
import { Guid } from "./Guid";

export type MechanicalAbility = {
	id: Guid;
	order: number;
	name: string;
	definition: string;
	category: keyof typeof MechanicalAbilityCategory;
	trigger: keyof typeof MechanicalAbilityTrigger;
};

export enum MechanicalAbilityCategory {
	Unknown,

	Legendary,
	Mythic,
	Lair,
	Free,
	Common,
	Other,
}
export enum MechanicalAbilityTrigger {
	Unknown,

	Passive,
	Action,
	BonusAction,
	Reaction,
	Other,
}

export const MechanicalAbilityCategoryName: Record<
	keyof typeof MechanicalAbilityCategory,
	string
> = {
	Unknown: "Desconhecido",
	Legendary: "Lendário",
	Mythic: "Mítico",
	Lair: "Covil",
	Free: "Livre",
	Common: "Comum",
	Other: "Outro",
};
export const MechanicalAbilityCategoryColor: Record<
	keyof typeof MechanicalAbilityCategory,
	keyof typeof StandartTextColor
> = {
	Unknown: "brown",
	Legendary: "yellow",
	Mythic: "purple",
	Lair: "red",
	Free: "blue",
	Common: "gray",
	Other: "green",
};

export const MechanicalAbilityTriggerName: Record<
	keyof typeof MechanicalAbilityTrigger,
	string
> = {
	Unknown: "Desconhecido",
	Passive: "Passivo",
	Action: "Ativo",
	BonusAction: "Bônus",
	Reaction: "Reação",
	Other: "Outro",
};
