import { Metadata } from "next";
import { getPageData } from ".";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ skillSlug: string }>;
}): Promise<Metadata> {
	const { skillSlug } = await params;
	const skillPageData = await getPageData(skillSlug);
	if (skillPageData.skillData == undefined) {
		return { title: "Not Found" };
	}
	const { skillData } = skillPageData;

	const title = skillData.name;

	return {
		title,
		icons: { icon: skillData.iconUrl },
	};
}
