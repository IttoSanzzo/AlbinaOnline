import "server-only";

import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client";

const notionClientToken = process.env.NOTION_CLIENT_TOKEN!;
const notionClientUserId = process.env.NOTION_CLIENT_USER_ID!;
const notionApiCodexToken = process.env.NOTION_API_CODEX_TOKEN!;

export const Notion = {
	client: new NotionAPI({
		authToken: notionClientToken,
		activeUser: notionClientUserId,
	}),
	codexApi: new Client({
		auth: notionApiCodexToken,
	}),
};

const notionDsChangelogId = process.env.NOTION_DS_CHANGELOG_ID!;
export const NotionStaticIds = {
	changelogDatabase: notionDsChangelogId,
};

export * from "./components";
export * from "./functions/NotionhqClient";
