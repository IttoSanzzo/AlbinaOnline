import { Notion, NotionStaticIds } from "../..";
import { PageObjectResponse } from "@notionhq/client";
import { unstable_cache } from "next/cache";

const revalidationTime = 60 * 60; // 1h

export const fetchCollection = unstable_cache(
	async () => {
		const response = await Notion.codexApi.dataSources.retrieve({
			data_source_id: NotionStaticIds.codexDatabase,
		});
		return response;
	},
	["codex-collection"],
	{ revalidate: revalidationTime }
);
export const fetchCorePage = unstable_cache(
	async () => {
		const response = await Notion.codexApi.pages.retrieve({
			page_id: NotionStaticIds.codexCorePage,
		});
		return response;
	},
	["codex-core-page"],
	{ revalidate: revalidationTime }
);
export const fetchPages = unstable_cache(
	async () => {
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
	},
	["codex-pages"],
	{
		revalidate: revalidationTime,
	}
);
export const fetchPageByPath = unstable_cache(
	async (path: string) => {
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
	},
	["codex-page"],
	{ revalidate: revalidationTime }
);
