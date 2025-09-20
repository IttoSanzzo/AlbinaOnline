import { unstable_cache } from "next/cache";
import { Notion } from "../..";
import { BlockObjectResponse } from "@notionhq/client";

const revalidationTime = Number(process.env.NOTION_FETCH_REVALIDATION_SECONDS!);

export const fetchPage = unstable_cache(
	async (pageId: string) => {
		const page = await Notion.codexApi.pages.retrieve({
			page_id: pageId,
		});
		return page;
	},
	["generic-page-blocks"],
	{
		revalidate: revalidationTime,
	}
);
export const fetchPageBlocks = unstable_cache(
	async (pageId: string) => {
		const children = await Notion.codexApi.blocks.children.list({
			block_id: pageId,
		});
		return children.results as BlockObjectResponse[];
	},
	["generic-page-blocks"],
	{
		revalidate: revalidationTime,
	}
);
