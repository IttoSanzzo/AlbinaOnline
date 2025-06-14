import { Metadata } from "next";
import { getPageData } from ".";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ spellSlug: string }>;
}): Promise<Metadata> {
	const { spellSlug } = await params;
	const spellPageData = await getPageData(spellSlug);
	if (spellPageData.spellData == undefined) {
		return { title: "Not Found" };
	}
	const { spellData } = spellPageData;

	const title = spellData.name;

	return {
		title,
		icons: { icon: spellData.iconUrl },
	};
}
