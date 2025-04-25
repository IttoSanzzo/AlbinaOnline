import { Metadata } from "next";
import { getPageData } from "./pageData";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ masterySlug: string }>;
}): Promise<Metadata> {
	const { masterySlug } = await params;
	const MasteryPageData = await getPageData(masterySlug);
	if (MasteryPageData.masteryData == undefined) {
		return { title: "Not Found" };
	}
	const { masteryData } = MasteryPageData;

	const title = `Maestria - ${masteryData.name}`;

	return {
		title,
		icons: { icon: masteryData.iconUrl },
	};
}
