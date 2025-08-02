import { SkillData } from "../../skill";

export type CharacterSkill = {
	id: string;
	characterId: string;
	skillId: string;
};
export type CharacterSkillExpanded = {
	skill: SkillData;
} & CharacterSkill;
