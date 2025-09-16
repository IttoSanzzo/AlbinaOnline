import {
	fetchChangelogPageByVersion,
	fetchPageBlocks,
} from "@/libs/stp@notion";

export default async function test() {
	const version = "6.4.4";
	const notionPage = await fetchChangelogPageByVersion(version);
	if (!notionPage) {
		return <div>Changelog not found</div>;
	}
	const content = await fetchPageBlocks(notionPage.id);

	console.log(content);

	return <>Banana1</>;
}
