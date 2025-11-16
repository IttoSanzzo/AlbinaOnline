import { SkillData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";

type SkillPageData = {
	skillData?: SkillData;
	borderColor: string;
};

function getSubTypeBorderColor(subType: string): string {
	switch (subType) {
		default:
			return "";
	}
}

export async function getPageData(skillSlug: string): Promise<SkillPageData> {
	if (!skillSlug) return { skillData: undefined, borderColor: "" };

	const response = await fetch(
		getAlbinaApiFullAddress(`/skills/${skillSlug}`),
		{
			cache: getCacheMode(),
		}
	);
	if (!response.ok) return { skillData: undefined, borderColor: "" };
	const skillData = convertEnumsFromResponse<SkillData>(await response.json());

	return {
		skillData,
		borderColor: getSubTypeBorderColor(skillData.subType),
	};
}
