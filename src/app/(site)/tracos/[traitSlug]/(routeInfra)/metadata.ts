import { Metadata } from "next";
import { getPageData } from ".";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ traitSlug: string }>;
}): Promise<Metadata> {
	const { traitSlug } = await params;
	const traitPageData = await getPageData(traitSlug);
	if (traitPageData.traitData == undefined) {
		return { title: "Not Found" };
	}
	const { traitData } = traitPageData;

	const title = traitData.name;

	return {
		title,
		icons: { icon: traitData.iconUrl },
	};
}
