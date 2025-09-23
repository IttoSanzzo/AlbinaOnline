import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import {
	Breadcrumb,
	SetAnchorNavigation,
	SetBreadcrumbs,
} from "@/libs/stp@hooks";
import {
	getAnchorPropsFromNotionPage,
	getNotionImage,
	NotionXRenderer,
} from "@/libs/stp@notion";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { PageObjectResponse } from "@notionhq/client";
import { ExtendedRecordMap } from "notion-types";

interface PageContentProps {
	recordMap: ExtendedRecordMap;
	page: PageObjectResponse;
}
export default async function PageContent({
	recordMap,
	page,
}: PageContentProps) {
	const versionName = (
		page.properties.Version as unknown as { title: [{ plain_text: string }] }
	).title[0].plain_text;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/changelogs",
			name: "Changelogs",
			icon: getAlbinaApiAddress("/favicon/core-page/changelogs"),
		},
		{
			href: `/changelogs/${versionName}`,
			name: versionName,
			icon: getAlbinaApiAddress("/favicon/core-page/changelogs"),
		},
	];

	const anchors = getAnchorPropsFromNotionPage(recordMap);

	return (
		<GenericPageContainer
			title={`Log ${versionName}`}
			icon={getNotionImage.Icon.PageObject(page)}
			banner={getNotionImage.Cover.PageObject(page)}>
			<SetAnchorNavigation anchors={anchors} />
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
			<NotionXRenderer.Default
				recordMap={recordMap}
				plugins={{
					Collection: false,
				}}
			/>
			<GenericPageFooter version={versionName} />
		</GenericPageContainer>
	);
}
