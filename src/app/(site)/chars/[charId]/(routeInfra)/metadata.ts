import { Metadata } from "next";
import { routeInfra } from ".";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ itemSlug: string }>;
}): Promise<Metadata> {
	const { itemSlug } = await params;
	// const itemPageData = await routeInfra;
	// if (itemPageData.itemData == undefined) {
	// return { title: "Not Found" };
	// }
	// const { itemData } = itemPageData;

	// const title = itemData.name;
	const title = "TESTING";

	return {
		title,
		// icons: { icon: itemData.iconUrl },
	};
}
