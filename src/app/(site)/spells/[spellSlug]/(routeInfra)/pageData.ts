import { SpellData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";

type SpellPageData = {
	spellData?: SpellData;
	borderColor: string;
};

function getSubTypeBorderColor(subType: string): string {
	switch (subType) {
		default:
			return "";
	}
}

export async function getPageData(spellSlug: string): Promise<SpellPageData> {
	if (!spellSlug) return { spellData: undefined, borderColor: "" };

	const response = await fetch(
		getAlbinaApiFullAddress(`/spells/${spellSlug}`),
		{
			cache: getCacheMode(),
		}
	);
	if (!response.ok) return { spellData: undefined, borderColor: "" };
	const spellData = convertEnumsFromResponse<SpellData>(await response.json());

	return {
		spellData,
		borderColor: getSubTypeBorderColor(spellData.subType),
	};
}
