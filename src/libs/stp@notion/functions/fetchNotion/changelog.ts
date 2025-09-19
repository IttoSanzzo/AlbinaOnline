import React from "react";
import { Notion, NotionStaticIds } from "../..";
import { PageObjectResponse } from "@notionhq/client";

export const fetchCollection = React.cache(async () => {
	const response = await Notion.codexApi.dataSources.retrieve({
		data_source_id: NotionStaticIds.changelogDatabase,
	});
	return response;
});
export const fetchPages = React.cache(async () => {
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
export const fetchPageByVersion = React.cache(async (version: string) => {
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
});
