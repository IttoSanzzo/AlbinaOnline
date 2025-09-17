"use client";

import { getPageTitle } from "notion-utils";
import { NotionRenderer } from "react-notion-x";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type ExtendedRecordMap } from "notion-types";
import { NotionAPI } from "notion-client";

// const tokenv2 =
// "v03%3AeyJhbGciOiJkaXIiLCJraWQiOiJwcm9kdWN0aW9uOnRva2VuLXYzOjIwMjQtMTEtMDciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0..mzEfLHXOVBsKTKj4hq_edw.tAryigDOG-zeg3gfDwPftpJXjdGYQj1Oq_DjmTrynb5Q4Lw9ASILLiM4ERdI_GQoGC0pOhI6oXtYmyp2VddlpgCAvVyuOtQrseTgyY9YRzvLUp2uk8w2TLqf8OEGpEMe7xargcmuuDfCooUCCDz6qwWfK0Nazf6NTltz0jkJ_Nh0fqrS6PZV8PdTCKkzXnZnDDqQg8MVr_7_zQdN0pssGTJRPNREuHjIWCR6kOfilupZTgzh1Hb2G5uyfJ3TRQfjE3GdP5pMlTNk4angWVpSONRJ7rJCOY7Ae0VFmaPRgHsrXaYgZdXUvA_NzgJaXTwBNxkg5v7xqEc0VMcmubxXfE-midbAlU7duGKcmCHJFok.AG68SDDBNdq_WQ6mv0oQ5cxvvc39-S86blJuN91puhA";
// const notionUserId = "379513c2-e3e3-4745-beab-83e27b4a9f4a";

const notion = new NotionAPI();
// {
// activeUser: notionUserId,
// authToken: tokenv2,
// }

export function NotionPage({
	recordMap,
	rootPageId,
}: {
	recordMap: ExtendedRecordMap;
	rootPageId?: string;
}) {
	if (!recordMap) {
		return null;
	}

	const title = getPageTitle(recordMap);

	return (
		<>
			{/* <Head>
				<meta
					name="description"
					content="React Notion X Minimal Demo"
				/>

				<title>{title}</title>
			</Head> */}

			<NotionRenderer
				recordMap={recordMap}
				fullPage={false}
				darkMode={true}
				rootPageId={rootPageId}
			/>
		</>
	);
}

export default function Page() {
	const { pageId } = useParams<{ pageId: string }>();
	const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);

	const pageIdM = "Test-270b1b1c8baa80608edbd2a82b680c95";

	useEffect(() => {
		console.log("EFFECT");
		try {
			notion.getPage(pageIdM).then(async (response) => {
				console.log("A");
				console.log(response);
				console.log("B");
				setRecordMap(response);
			});
		} catch (ex) {
			console.log(`Exception: ${ex}`);
		}
	}, []);
	if (recordMap == null) return <>Banana</>;

	return (
		<>
			RUN!
			{/* <NotionPage */}
			{/* recordMap={recordMap} */}
			{/* rootPageId={rootNotionPageId} */}
			{/* /> */}
		</>
	);
}
