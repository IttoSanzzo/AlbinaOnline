import {
	getAnchorPropsFromNotionPage,
	getNotionImage,
	NotionXRenderer,
} from "@/libs/stp@notion";
import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { GetPageResponse } from "@notionhq/client";
import { ExtendedRecordMap } from "notion-types";
import { SetAnchorNavigation } from "@/libs/stp@hooks";

const getPageTitle = (page: GetPageResponse) =>
	(
		page as unknown as {
			properties: { title: { title: { plain_text: string }[] } };
		}
	).properties.title.title[0].plain_text;

interface PageContentProps {
	recordMap: ExtendedRecordMap;
	page: GetPageResponse;
}
export default async function PageContent({
	page,
	recordMap,
}: PageContentProps) {
	const title = getPageTitle(page);

	const anchors = getAnchorPropsFromNotionPage(recordMap);

	return (
		<GenericPageContainer
			title={title}
			icon={getNotionImage.Icon.PageResponse(page)}
			banner={getNotionImage.Cover.PageResponse(page)}>
			<SetAnchorNavigation anchors={anchors} />

			<NotionXRenderer.Default
				recordMap={recordMap}
				targetDatabase="codex"
				plugins={{
					Collection: false,
				}}
			/>
			<GenericPageFooter version={"7.0.0"} />
		</GenericPageContainer>
	);
}
