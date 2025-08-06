import { Guid } from "@/libs/stp@types/misc";
import { SkillData } from "../../skill";

export type CharacterSkill = {
	id: Guid;
	characterId: Guid;
	skillId: Guid;
};
export type CharacterSkillExpanded = {
	skill: SkillData;
} & CharacterSkill;
