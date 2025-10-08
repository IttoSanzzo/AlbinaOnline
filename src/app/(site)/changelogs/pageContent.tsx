import { getNotionImage } from "@/libs/stp@notion";
import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { SetBreadcrumbs } from "@/libs/stp@hooks";
import { GetDataSourceResponse, PageObjectResponse } from "@notionhq/client";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { Guid } from "@/libs/stp@types";

interface PageContentProps {
	// recordMap: ExtendedRecordMap;
	collection: GetDataSourceResponse;
	collectionPages: PageObjectResponse[];
}
export default async function PageContent({
	collection,
	collectionPages,
}: // recordMap,
PageContentProps) {
	// const anchors = getAnchorPropsFromNotionPage(recordMap);

	const tableMap = (
		collectionPages as unknown as {
			id: Guid;
			properties: {
				Version: { title: { plain_text: string }[] };
				Summary: { rich_text: { plain_text: string }[] };
				Tags: {
					multi_select: {
						id: Guid;
						name: string;
						color: keyof typeof StandartTextColor;
					}[];
				};
				Status: {
					status: {
						name: string;
						color: keyof typeof StandartTextColor;
					};
				};
			};
		}[]
	).map((collectionPage) => ({
		id: collectionPage.id,
		version: collectionPage.properties.Version.title[0].plain_text,
		summary: collectionPage.properties.Summary.rich_text[0].plain_text,
		tags: collectionPage.properties.Tags.multi_select.map((tag) => ({
			id: tag.id,
			name: tag.name,
			color: tag.color,
		})),
		status: {
			name: collectionPage.properties.Status.status.name,
			color: collectionPage.properties.Status.status.color,
		},
	}));

	return (
		<GenericPageContainer
			title={`Changelogs`}
			icon={getNotionImage.Icon.DataSource(collection)}
			banner={getNotionImage.Cover.DataSource(collection)}>
			{/* <SetAnchorNavigation anchors={anchors} /> */}
			<SetBreadcrumbs
				breadcrumbs={[
					{
						href: "/changelogs",
						name: "Changelogs",
						icon: getNotionImage.Icon.DataSource(collection),
					},
				]}
			/>

			{/* <NotionXRenderer.Default
				recordMap={recordMap}
				mapLinkImageUrlsToAlbinaApiRoute={"/favicon/misc/changelog"}
				targetDatabase={"changelog"}
				plugins={{
					Collection: true,
				}}
			/> */}

			<UIBasics.Table
				fixedLineWidths={[10, 13, 25]}
				fixedLinePositions={[1, 3, 4]}
				columnBackgroundColors={[undefined, "gray", undefined, "gray"]}
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<UIBasics.Text
								textAlign="center"
								children="Versão"
								withBold
							/>,
							<UIBasics.Text
								display="block"
								textAlign="center"
								children="Alcunha"
								withBold
							/>,
							<UIBasics.Text
								display="block"
								textAlign="center"
								children="Status"
								withBold
							/>,
							<UIBasics.Text
								display="block"
								textAlign="center"
								children="Tags"
								withBold
							/>,
						],
						...tableMap.map((versionData) => [
							<StyledLink
								key={versionData.id}
								href={`/changelogs/${versionData.version}`}
								title={versionData.version}
							/>,
							<UIBasics.Text
								key={versionData.id}
								display="block"
								children={versionData.summary}
								textColor="gray"
							/>,
							<UIBasics.Text
								key={versionData.id}
								display="block"
								textAlign="center"
								withBold
								withItalic
								children={versionData.status.name}
								textColor={versionData.status.color}
							/>,
							<div key={versionData.id}>
								{versionData.tags.map((tag, index) => (
									<UIBasics.Text
										key={tag.id}
										children={index === 0 ? tag.name : `, ${tag.name}`}
										textColor={tag.color}
									/>
								))}
							</div>,
						]),
					],
				}}
			/>
		</GenericPageContainer>
	);
}
