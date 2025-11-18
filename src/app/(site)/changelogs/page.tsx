import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import PageContent from "./pageContent";
import { fetchNotion } from "@/libs/stp@notion";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Changelogs",
	icon: getAlbinaApiFullAddress("/favicon/core-page/changelogs"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/changelogs"),
	},
	route: "/changelogs",
});

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
