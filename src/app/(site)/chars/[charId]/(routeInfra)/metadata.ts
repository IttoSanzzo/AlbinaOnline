import { Metadata } from "next";
import { getPageData } from ".";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ itemSlug: string }>;
}): Promise<Metadata> {
	const { itemSlug } = await params;
	const itemPageData = await getPageData(itemSlug);
	if (itemPageData.itemData == undefined) {
		return { title: "Not Found" };
	}
	const { itemData } = itemPageData;

	const title = itemData.name;

	return {
		title,
		icons: { icon: itemData.iconUrl },
	};
}
