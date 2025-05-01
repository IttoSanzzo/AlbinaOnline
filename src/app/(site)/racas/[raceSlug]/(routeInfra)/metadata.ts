import { Metadata } from "next";
import { getPageData } from ".";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ raceSlug: string }>;
}): Promise<Metadata> {
	const { raceSlug } = await params;
	const racePageData = await getPageData(raceSlug);
	if (racePageData.raceData == undefined) {
		return { title: "Not Found" };
	}
	const { raceData } = racePageData;

	const title = raceData.name;

	return {
		title,
		icons: { icon: raceData.iconUrl },
	};
}
