import React from "react";
import { Notion, NotionStaticIds } from "../..";
import { PageObjectResponse } from "@notionhq/client";

export const fetchCollection = React.cache(async () => {
	const response = await Notion.codexApi.dataSources.retrieve({
		data_source_id: NotionStaticIds.codexDatabase,
	});
	return response;
});
export const fetchPages = React.cache(async () => {
	const response = await Notion.codexApi.dataSources.query({
		data_source_id: NotionStaticIds.codexDatabase,
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
export const fetchPageByPath = React.cache(async (path: string) => {
	const response = await Notion.codexApi.dataSources.query({
		data_source_id: NotionStaticIds.codexDatabase,
		filter: {
			and: [
				{
					property: "Status",
					status: {
						equals: "Done",
					},
				},
				{
					property: "Path",
					rich_text: {
						equals: path,
					},
				},
			],
		},
	});
	return response.results[0] as PageObjectResponse | undefined;
});
