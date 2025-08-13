import { Metadata } from "next";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import ItemPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";

interface ItemPageServerShellProps {
	params: Promise<{ itemSlug: string }>;
}

export async function generateMetadata({
	params,
}: ItemPageServerShellProps): Promise<Metadata> {
	const { itemSlug } = await params;

	const response = await fetch(
		getAlbinaApiAddress(`/items/${itemSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-item-${itemSlug}`],
			},
		}
	);
	if (!response.ok) {
		return {
			title: "???",
		};
	}
	const data = await response.json();
	return {
		title: data.title,
		icons: { icon: data.icon },
	};
}

export default async function ItemPageServerShell({
	params,
}: ItemPageServerShellProps) {
	const { itemSlug } = await params;

	return <ItemPageContent itemSlug={itemSlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("items");
}
