import React from "react";
import { Notion } from "../..";
import { BlockObjectResponse } from "@notionhq/client";

export const fetchPage = React.cache(async (pageId: string) => {
	const page = await Notion.codexApi.pages.retrieve({
		page_id: pageId,
	});
	return page;
});
export const fetchPageBlocks = React.cache(async (pageId: string) => {
	const children = await Notion.codexApi.blocks.children.list({
		block_id: pageId,
	});
	return children.results as BlockObjectResponse[];
});
