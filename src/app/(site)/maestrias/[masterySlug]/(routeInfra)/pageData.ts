import { MasteryData } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";

type MasteryPageData = {
	masteryData?: MasteryData;
	borderColor: string;
};

function getCategoryBorderColor(category: string): string {
	switch (category) {
		case "strength":
			return "#D44C47";
		case "agility":
			return "#337EA9";
		case "intelligence":
			return "#C14C8A";
		case "wisdom":
			return "#9065B0";
		case "technique":
			return "#448361";
		case "constitution":
			return "#D9730D";
		case "charisma":
			return "#CB912F";
		case "singular":
			return "#337EA9";
		case "multiple":
			return "#D9730D";
		case "general":
			return "#448361";
		case "production":
			return "#337EA9";
		case "combatant":
			return "#D44C47";
		case "armed":
			return "#337EA9";
		case "armored":
			return "#D9730D";
		case "focus":
			return "#9065B0";
		case "combatStyle":
			return "#D44C47";
		case "tool":
			return "#9F6B53";
		default:
			return "";
	}
}

export async function getPageData(
	masterySlug: string
): Promise<MasteryPageData> {
	if (!masterySlug) return { masteryData: undefined, borderColor: "" };

	const response = await fetch(
		getAlbinaApiAddress(`/maestrias/${masterySlug}`),
		{
			cache: getCacheMode(),
		}
	);
	if (!response.ok) return { masteryData: undefined, borderColor: "" };
	const masteryData = convertEnumsFromResponse<MasteryData>(
		await response.json()
	);

	return {
		masteryData,
		borderColor: getCategoryBorderColor(masteryData.subType),
	};
}
