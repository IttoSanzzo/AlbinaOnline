import { ExtendedRecordMap } from "notion-types";

export function defaultMapNotionPageUrl(
	pageId: string,
	recordMap?: ExtendedRecordMap | undefined,
	database?: "changelog" | "codex"
): string {
	if (database) return `/redirect/notion-link/${pageId}?database=${database}`;
	return `/redirect/notion-link/${pageId}`;
}
