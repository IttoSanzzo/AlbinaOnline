import {
	fetchChangelogPageByVersion,
	Notion,
	NotionXRenderer,
} from "@/libs/stp@notion";
import { GenericPageContainer } from "@/components/(Design)";
import { redirect } from "next/navigation";

interface ChangelogPageServerShellProps {
	params: Promise<{ version: string }>;
}
export default async function ChangelogPageServerShell({
	params,
}: ChangelogPageServerShellProps) {
	const { version } = await params;

	const page = await fetchChangelogPageByVersion(version);
	if (!page) redirect("/changelog");
	const recordMap = await Notion.client.getPage(page.id);

	return (
		<GenericPageContainer title={`Log ${version}`}>
			<NotionXRenderer.Default recordMap={recordMap} />
		</GenericPageContainer>
	);
}
