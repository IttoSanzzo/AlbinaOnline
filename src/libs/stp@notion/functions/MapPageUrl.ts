import { ExtendedRecordMap } from "notion-types";

export function defaultMapNotionPageUrl(
	pageId: string,
	recordMap?: ExtendedRecordMap | undefined,
	database?: "changelog" | "codex",
	root: string = "/redirect/notion-link"
): string {
	if (database) return `${root}/${pageId}?database=${database}`;
	return `${root}/${pageId}`;
}
