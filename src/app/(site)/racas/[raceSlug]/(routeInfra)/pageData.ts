import { RaceData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";

type RacePageData = {
	raceData?: RaceData;
	borderColor: string;
};

function getSubTypeBorderColor(subType: string): string {
	switch (subType) {
		default:
			return "";
	}
}

export async function getPageData(raceSlug: string): Promise<RacePageData> {
	if (!raceSlug) return { raceData: undefined, borderColor: "" };

	const response = await fetch(`${process.env.ALBINA_API}/races/${raceSlug}`, {
		cache: await getCacheMode(),
	});
	if (!response.ok) return { raceData: undefined, borderColor: "" };
	const raceData = convertEnumsFromResponse<RaceData>(await response.json());

	return {
		raceData,
		borderColor: getSubTypeBorderColor(raceData.subType),
	};
}
