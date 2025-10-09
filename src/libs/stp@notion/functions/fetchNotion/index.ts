import * as Changelog from "./changelog";
import * as Codex from "./codex";
import * as Generic from "./generic";

export const fetchNotion = {
	Changelog: {
		Collection: Changelog.fetchCollection,
		Pages: Changelog.fetchPages,
		PageByVersion: Changelog.fetchPageByVersion,
	},
	Codex: {
		Collection: Codex.fetchCollection,
		Pages: Codex.fetchPages,
		PageByPath: Codex.fetchPageByPath,
		PageById: Codex.fetchPageById,
		CorePage: Codex.fetchCorePage,
	},
	Generic: {
		Page: Generic.fetchPage,
		PageBlocks: Generic.fetchPageBlocks,
	},
};
