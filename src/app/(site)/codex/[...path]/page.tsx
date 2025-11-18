import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { capitalizeAll } from "@/utils/StringUtils";
import { fetchNotion, getNotionImage, Notion } from "@/libs/stp@notion";
import { redirect } from "next/navigation";
import { PageObjectResponse } from "@notionhq/client";
import PageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

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
		return assembleMetadata({
			title: capitalizeAll(path[path.length - 1]),
			icon: getAlbinaApiFullAddress("/favicon/misc/codex"),
			ogImage: {
				url: getAlbinaApiFullAddress("/banner/misc/codex"),
			},
			route: `/codex${fullPath}`,
		});
	return assembleMetadata({
		title: getPageName(page),
		icon:
			getNotionImage.Icon.PageObject(page) ??
			getAlbinaApiFullAddress("/favicon/misc/codex"),
		ogImage: {
			url:
				getNotionImage.Cover.PageObject(page) ??
				getAlbinaApiFullAddress("/banner/misc/codex"),
		},
		route: `/codex${fullPath}`,
	});
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
