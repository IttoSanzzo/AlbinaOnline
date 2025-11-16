import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import PageContent from "./pageContent";
import { fetchNotion, Notion } from "@/libs/stp@notion";

export const metadata: Metadata = {
	title: "Codex",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/codex"),
	},
};

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
