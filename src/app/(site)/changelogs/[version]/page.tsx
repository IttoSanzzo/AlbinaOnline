import { fetchNotion, getNotionImage, Notion } from "@/libs/stp@notion";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { PageObjectResponse } from "@notionhq/client";
import PageContent from "./pageContent";

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
		return {
			title: `Log ${version}`,
			icons: {
				icon: getAlbinaApiFullAddress("/favicon/misc/changelog"),
			},
		};
	return {
		title: `Log ${getPageName(page)}`,
		icons: {
			icon: getNotionImage.Icon.PageObject(page),
		},
	};
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
