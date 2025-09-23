import { AnchorProps } from "@/libs/stp@hooks";
import { ExtendedRecordMap, PageBlock } from "notion-types";
import { getPageTableOfContents, TableOfContentsEntry } from "notion-utils";

export function getNotionPageTableOfContents(
	recordMap: ExtendedRecordMap
): Array<TableOfContentsEntry> {
	const keys = Object.keys(recordMap?.block || {});
	const pageBlock = recordMap.block[keys[0]].value;
	return getPageTableOfContents(pageBlock as PageBlock, recordMap);
}

export function getAnchorPropsFromTableOfContents(
	tableOfContents: TableOfContentsEntry[]
): AnchorProps[] {
	return tableOfContents.map(({ id, indentLevel, text }) => ({
		id: id.replaceAll("-", ""),
		name: text.replace("》", ""),
		indentation: indentLevel as 0 | 1 | 2,
	}));
}

export function getAnchorPropsFromNotionPage(
	recordMap: ExtendedRecordMap
): AnchorProps[] {
	return getAnchorPropsFromTableOfContents(
		getNotionPageTableOfContents(recordMap)
	);
}
