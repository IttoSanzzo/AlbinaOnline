import {
	fetchChangelogPageByVersion,
	fetchPageBlocks,
	notion,
} from "@/libs/stp@notion";
import { NotionRenderer } from "@notion-render/client";
import HljsPlugin from "@notion-render/hljs-plugin";
import BookmarkPlugin from "@notion-render/bookmark-plugin";
import { GenericPageContainer } from "@/components/(Design)";

interface ChangelogPageServerShellProps {
	params: Promise<{ version: string }>;
}
export default async function ChangelogPageServerShell({
	params,
}: ChangelogPageServerShellProps) {
	const { version } = await params;
	const notionPage = await fetchChangelogPageByVersion(version);
	if (!notionPage) {
		return <div>Changelog not found</div>;
	}

	const pageBlocks = await fetchPageBlocks(notionPage.id);
	const renderer = new NotionRenderer({ client: notion });
	renderer.use(HljsPlugin({}));
	renderer.use(BookmarkPlugin(undefined));

	const html = await renderer.render(...pageBlocks);

	return (
		<GenericPageContainer title={`Log ${version}`}>
			<div style={{ background: "white" }}>
				<div
					className="prose"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</GenericPageContainer>
	);
}
