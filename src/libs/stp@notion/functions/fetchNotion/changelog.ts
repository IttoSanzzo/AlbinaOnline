import { Notion, NotionStaticIds } from "../..";
import { PageObjectResponse } from "@notionhq/client";
import { unstable_cache } from "next/cache";

const revalidationTime = 60 * 60; // 1h

export const fetchCollection = unstable_cache(
	async () => {
		const response = await Notion.codexApi.dataSources.retrieve({
			data_source_id: NotionStaticIds.changelogDatabase,
		});
		return response;
	},
	["generic-page-blocks"],
	{
		revalidate: revalidationTime,
	}
);
export const fetchPages = unstable_cache(
	async () => {
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
	},
	["generic-page-blocks"],
	{
		revalidate: revalidationTime,
	}
);
export const fetchPageByVersion = unstable_cache(
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
	},
	["generic-page-blocks"],
	{
		revalidate: revalidationTime,
	}
);
