import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client";

import { Notion, NotionStaticIds } from "..";
import React from "react";

export const fetchChangelogPages = React.cache(async () => {
	const response = await Notion.codexApi.dataSources.query({
		data_source_id: NotionStaticIds.changelogDatabase,
		filter: {
			property: "Status",
			status: {
				equals: "Done",
			},
		},
		sorts: [
			{
				property: "Version",
				direction: "descending",
			},
		],
	});
	return response.results as PageObjectResponse[] | undefined;
});
export const fetchChangelogPageByVersion = React.cache(
	async (version: string) => {
		const response = await Notion.codexApi.dataSources.query({
			data_source_id: NotionStaticIds.changelogDatabase,
			filter: {
				and: [
					{
						property: "Status",
						status: {
							equals: "Done",
						},
					},
					{
						property: "Version",
						rich_text: {
							equals: version,
						},
					},
				],
			},
		});
		return response.results[0] as PageObjectResponse | undefined;
	}
);
export const fetchPageBlocks = React.cache(async (pageId: string) => {
	const children = await Notion.codexApi.blocks.children.list({
		block_id: pageId,
	});
	return children.results as BlockObjectResponse[];
});
