import "server-only";
import {
	BlockObjectResponse,
	Client,
	PageObjectResponse,
} from "@notionhq/client";
import React from "react";
import { error } from "console";

const notionApiCodexToken = process.env.NOTION_API_CODEX_TOKEN!;
const notionDbChangelogId = process.env.NOTION_DB_CHANGELOG_ID!;
const notionDsChangelogId = process.env.NOTION_DS_CHANGELOG_ID!;

export const notion = new Client({
	auth: notionApiCodexToken,
});

export const fetchChangelogPages = React.cache(async () => {
	const response = await notion.dataSources.query({
		data_source_id: notionDsChangelogId,
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
		const response = await notion.dataSources.query({
			data_source_id: notionDsChangelogId,
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
	const children = await notion.blocks.children.list({
		block_id: pageId,
	});
	return children.results as BlockObjectResponse[];
});
