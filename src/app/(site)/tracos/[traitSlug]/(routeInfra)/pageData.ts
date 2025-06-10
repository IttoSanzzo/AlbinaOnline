import { TraitData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";

type TraitPageData = {
	traitData?: TraitData;
	borderColor: string;
};

function getSubTypeBorderColor(subType: string): string {
	switch (subType) {
		default:
			return "";
	}
}

export async function getPageData(traitSlug: string): Promise<TraitPageData> {
	if (!traitSlug) return { traitData: undefined, borderColor: "" };

	const response = await fetch(
		`${process.env.ALBINA_API}/traits/${traitSlug}`,
		{
			cache: await getCacheMode(),
		}
	);
	if (!response.ok) return { traitData: undefined, borderColor: "" };
	const traitData = convertEnumsFromResponse<TraitData>(await response.json());

	return {
		traitData,
		borderColor: getSubTypeBorderColor(traitData.subType),
	};
}
