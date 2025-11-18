import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { capitalizeAll } from "@/utils/StringUtils";
import { fetchNotion, getNotionImage, Notion } from "@/libs/stp@notion";
import { PageObjectResponse } from "@notionhq/client";
import PageContent from "../../[...path]/pageContent";
import { redirect } from "next/navigation";
import { assembleMetadata } from "@/metadata/assembleMetadata";

const getPageName = (page: PageObjectResponse) =>
	(page.properties.Name as unknown as { title: [{ plain_text: string }] })
		.title[0].plain_text;

interface CodexEntryPageFromIdServerShellProps {
	params: Promise<{ pageId: string }>;
}
export async function generateMetadata({
	params,
}: CodexEntryPageFromIdServerShellProps): Promise<Metadata> {
	const { pageId } = await params;

	const pageById = await fetchNotion.Codex.PageById(pageId);
	const fullPath = (
		pageById as unknown as {
			properties: { Path: { rich_text: { plain_text: string }[] } };
		}
	).properties.Path.rich_text[0].plain_text;
	const page = await fetchNotion.Codex.PageByPath(fullPath);
	const path = fullPath.split("/");
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
}: CodexEntryPageFromIdServerShellProps) {
	const { pageId } = await params;

	const pageById = await fetchNotion.Codex.PageById(pageId);
	const fullPath = (
		pageById as unknown as {
			properties: { Path: { rich_text: { plain_text: string }[] } };
		}
	).properties.Path.rich_text[0].plain_text;
	const path = fullPath.split("/").slice(1);

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
