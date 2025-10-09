import {
	fetchNotion,
	getNotionImage,
	NotionXRenderer,
} from "@/libs/stp@notion";
import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { Breadcrumb, SetBreadcrumbs } from "@/libs/stp@hooks";
import { PageObjectResponse } from "@notionhq/client";
import { ExtendedRecordMap } from "notion-types";
import { capitalizeAll } from "@/utils/StringUtils";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import SetNotionPageAnchorNavigation from "@/libs/stp@notion/components/SetNotionPageAnchorNavigation";

const getPageName = (page: PageObjectResponse) =>
	(page.properties.Name as unknown as { title: [{ plain_text: string }] })
		.title[0].plain_text;

interface PageContentProps {
	recordMap: ExtendedRecordMap;
	page: PageObjectResponse;
	path: string[];
}
export default async function PageContent({
	page,
	recordMap,
	path,
}: PageContentProps) {
	const name = getPageName(page);
	const version = (
		page.properties.Version as unknown as {
			rich_text: [{ plain_text: string }];
		}
	).rich_text[0].plain_text;

	const fillerBreadcrumbs = await Promise.all(
		path
			.slice(0, path.length - 1)
			.map(async (pathSlug, index): Promise<Breadcrumb> => {
				const href = `/${path.slice(0, index + 1).join("/")}`;
				const crumbPage = await fetchNotion.Codex.PageByPath(href);
				if (!crumbPage)
					return {
						href: `/codex${href}`,
						name: capitalizeAll(pathSlug),
						icon: getAlbinaApiAddress("/favicon/misc/codex"),
					};
				return {
					href: `/codex${href}`,
					name: getPageName(crumbPage),
					icon: getNotionImage.Icon.PageObject(crumbPage),
				};
			})
	);
	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/codex",
			name: "Codex",
			icon: getAlbinaApiAddress("/favicon/core-page/codex"),
		},
		...fillerBreadcrumbs,
		{
			href: `/codex${path[path.length - 1]}`,
			name: getPageName(page),
			icon: getNotionImage.Icon.PageObject(page),
		},
	];

	return (
		<GenericPageContainer
			title={name}
			icon={getNotionImage.Icon.PageObject(page)}
			banner={getNotionImage.Cover.PageObject(page)}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
			<SetNotionPageAnchorNavigation />

			<NotionXRenderer.Default
				recordMap={recordMap}
				targetDatabase="codex"
				targetRoot="/codex/from-id"
				plugins={{
					Collection: false,
				}}
			/>
			<GenericPageFooter version={version} />
		</GenericPageContainer>
	);
}
