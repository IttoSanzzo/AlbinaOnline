import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import PageContent from "./pageContent";
import { fetchNotion, Notion } from "@/libs/stp@notion";

export const metadata: Metadata = {
	title: "Changelogs",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/changelogs"),
	},
};

export default async function PageServerShell() {
	const collection = await fetchNotion.Changelog.Collection();
	if (!collection) return <>Notion Error</>;
	const recordMap = await Notion.client.getPage(
		"270b1b1c8baa8067b03fc47a3e817bc7"
	);

	return (
		<PageContent
			recordMap={recordMap}
			collection={collection}
		/>
	);
}
