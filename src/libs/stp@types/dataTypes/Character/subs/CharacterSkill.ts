import { Guid } from "@/libs/stp@types/misc";
import { SkillData } from "../../skill";

export type CharacterSkill = {
	id: Guid;
	characterId: Guid;
	skillId: Guid;
	notes: string;
};
export type CharacterSkillExpanded = {
	skill: SkillData;
} & CharacterSkill;
