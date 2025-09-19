import { getNotionImage, NotionXRenderer } from "@/libs/stp@notion";
import { GenericPageContainer } from "@/components/(Design)";
import { SetBreadcrumbs } from "@/libs/stp@hooks";
import { GetDataSourceResponse } from "@notionhq/client";
import { ExtendedRecordMap } from "notion-types";

interface PageContentProps {
	recordMap: ExtendedRecordMap;
	collection: GetDataSourceResponse;
}
export default async function PageContent({
	collection,
	recordMap,
}: PageContentProps) {
	return (
		<GenericPageContainer
			title={`Changelogs`}
			icon={getNotionImage.Icon.DataSource(collection)}
			banner={getNotionImage.Cover.DataSource(collection)}>
			<SetBreadcrumbs
				breadcrumbs={[
					{
						href: "/changelogs",
						name: "Changelogs",
						icon: getNotionImage.Icon.DataSource(collection),
					},
				]}
			/>

			<NotionXRenderer.WithPlugins
				recordMap={recordMap}
				mapLinkImageUrlsToAlbinaApiRoute={"/favicon/misc/changelog"}
				targetDatabase={"changelog"}
				plugins={{
					Collection: true,
				}}
			/>
		</GenericPageContainer>
	);
}
