import { ItemData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";

type ItemPageData = {
	itemData?: ItemData;
	borderColor: string;
};

function getSubTypeBorderColor(subType: string): string {
	switch (subType) {
		default:
			return "";
	}
}

export async function getPageData(itemSlug: string): Promise<ItemPageData> {
	if (!itemSlug) return { itemData: undefined, borderColor: "" };

	const response = await fetch(`${process.env.ALBINA_API}/items/${itemSlug}`, {
		cache: getCacheMode(),
	});
	if (!response.ok) return { itemData: undefined, borderColor: "" };
	const itemData = convertEnumsFromResponse<ItemData>(await response.json());

	return {
		itemData,
		borderColor: getSubTypeBorderColor(itemData.subType),
	};
}
