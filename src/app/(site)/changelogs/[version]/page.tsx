import { fetchNotion, getNotionImage, Notion } from "@/libs/stp@notion";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { PageObjectResponse } from "@notionhq/client";
import PageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

const getPageName = (page: PageObjectResponse) =>
	(page.properties.Version as unknown as { title: [{ plain_text: string }] })
		.title[0].plain_text;

interface ChangelogPageServerShellProps {
	params: Promise<{ version: string }>;
}

export async function generateMetadata({
	params,
}: ChangelogPageServerShellProps): Promise<Metadata> {
	const { version } = await params;
	const page = await fetchNotion.Changelog.PageByVersion(version);
	if (!page)
		return assembleMetadata({
			title: `Log ${version}`,
			icon: getAlbinaApiFullAddress("/favicon/misc/changelog"),
			ogImage: {
				url: getAlbinaApiFullAddress("/banner/misc/changelog"),
			},
			route: `/changelogs/${version}`,
		});
	return assembleMetadata({
		title: `Log ${getPageName(page)}`,
		icon:
			getNotionImage.Icon.PageObject(page) ??
			getAlbinaApiFullAddress("/favicon/misc/changelog"),
		ogImage: {
			url:
				getNotionImage.Cover.PageObject(page) ??
				getAlbinaApiFullAddress("/banner/misc/changelog"),
		},
		route: `/changelogs/${version}`,
	});
}

export default async function ChangelogPageServerShell({
	params,
}: ChangelogPageServerShellProps) {
	const { version } = await params;

	const page = await fetchNotion.Changelog.PageByVersion(version);
	if (!page) redirect("/changelogs");
	const recordMap = await Notion.client.getPage(page.id);

	return (
		<PageContent
			recordMap={recordMap}
			page={page}
		/>
	);
}
