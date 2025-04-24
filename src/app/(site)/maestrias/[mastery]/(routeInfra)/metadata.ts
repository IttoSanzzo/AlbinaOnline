import { Metadata } from "next";
import { getPageData } from "./pageData";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ mastery: string }>;
}): Promise<Metadata> {
	const { mastery } = await params;
	const MasteryPageData = await getPageData(mastery);
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
