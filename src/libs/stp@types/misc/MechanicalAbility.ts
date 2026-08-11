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
