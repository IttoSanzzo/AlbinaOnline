import { ItemData } from "@/libs/stp@types";

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
		cache: "force-cache",
	});
	if (!response.ok) return { itemData: undefined, borderColor: "" };
	const itemData: ItemData = await response.json();

	return {
		itemData,
		borderColor: getSubTypeBorderColor(itemData.subType),
	};
}
