import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { capitalizeAll } from "@/utils/StringUtils";
import { fetchNotion, getNotionImage, Notion } from "@/libs/stp@notion";
import { redirect } from "next/navigation";
import { PageObjectResponse } from "@notionhq/client";
import PageContent from "./pageContent";

const getPageName = (page: PageObjectResponse) =>
	(page.properties.Name as unknown as { title: [{ plain_text: string }] })
		.title[0].plain_text;

interface CodexEntryPageServerShellProps {
	params: Promise<{ path: string[] }>;
}
export async function generateMetadata({
	params,
}: CodexEntryPageServerShellProps): Promise<Metadata> {
	const { path } = await params;
	const fullPath = `/${path.join("/")}`;
	const page = await fetchNotion.Codex.PageByPath(fullPath);
	if (!page)
		return {
			title: capitalizeAll(path[path.length - 1]),
			icons: {
				icon: getAlbinaApiFullAddress("/favicon/misc/codex"),
			},
		};
	return {
		title: getPageName(page),
		icons: {
			icon: getNotionImage.Icon.PageObject(page),
		},
	};
}

export default async function ChangelogPageServerShell({
	params,
}: CodexEntryPageServerShellProps) {
	const { path } = await params;
	const fullPath = `/${path.join("/")}`;

	const page = await fetchNotion.Codex.PageByPath(fullPath);
	if (!page) redirect("/codex");
	const recordMap = await Notion.client.getPage(page.id);

	return (
		<PageContent
			page={page}
			recordMap={recordMap}
			path={path}
		/>
	);
}
