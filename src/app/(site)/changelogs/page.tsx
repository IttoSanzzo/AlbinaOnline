import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import PageContent from "./pageContent";
import { fetchNotion } from "@/libs/stp@notion";

export const metadata: Metadata = {
	title: "Changelogs",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/changelogs"),
	},
};

export default async function PageServerShell() {
	const collection = await fetchNotion.Changelog.Collection();
	const collectionPages = await fetchNotion.Changelog.Pages();
	if (!collection) return <>Notion Error</>;
	// const recordMap = await Notion.client.getPage(
	// 	(collection as { parent: { database_id: string } }).parent.database_id
	// );

	return (
		<PageContent
			// recordMap={recordMap}
			collection={collection}
			collectionPages={collectionPages ?? []}
		/>
	);
}
