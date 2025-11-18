import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import PageContent from "./pageContent";
import { fetchNotion, Notion } from "@/libs/stp@notion";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Codex",
	icon: getAlbinaApiFullAddress("/favicon/core-page/codex"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/codex"),
	},
	route: "/codex",
});

export default async function PageServerShell() {
	const page = await fetchNotion.Codex.CorePage();
	if (!page) return <>Notion Error</>;
	const recordMap = await Notion.client.getPage(page.id);

	return (
		<PageContent
			recordMap={recordMap}
			page={page}
		/>
	);
}
