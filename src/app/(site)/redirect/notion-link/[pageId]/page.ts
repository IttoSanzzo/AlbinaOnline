import { fetchNotion } from "@/libs/stp@notion";
import { PageObjectResponse } from "@notionhq/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";

async function getLinkForChangelog(page: PageObjectResponse): Promise<string> {
	const redirectLink = (
		page.properties.Version as unknown as {
			title: [{ plain_text: string }];
		}
	).title[0].plain_text;
	return `/changelogs/${redirectLink}`;
}
async function getLinkForCodex(page: PageObjectResponse): Promise<string> {
	const redirectLink = (
		page.properties.Path as unknown as {
			rich_text: [{ plain_text: string }];
		}
	).rich_text[0].plain_text;
	return `/codex/${redirectLink}`;
}

export const metadata: Metadata = {
	title: "Redirecting...",
};

interface NotionLinkRedirectionProps {
	params: Promise<{ pageId: string }>;
	searchParams: Promise<{ database?: "changelog" | "codex" }>;
}
export default async function NotionLinkRedirection({
	params,
	searchParams,
}: NotionLinkRedirectionProps) {
	const { pageId } = await params;
	const { database } = await searchParams;

	let redirectLink;
	try {
		const page = await fetchNotion.Generic.Page(pageId);
		if (!page) return;
		switch (database) {
			case "changelog": {
				redirectLink = await getLinkForChangelog(page as PageObjectResponse);
				break;
			}
			case "codex": {
				redirectLink = await getLinkForCodex(page as PageObjectResponse);
				break;
			}
			default: {
				redirectLink = "/home";
				break;
			}
		}
	} catch {
		redirect("/home");
	}
	redirect(redirectLink);
}
