import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import ItemPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface ItemPageServerShellProps {
	params: Promise<{ itemSlug: string }>;
}

export async function generateMetadata({
	params,
}: ItemPageServerShellProps): Promise<Metadata> {
	const { itemSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/items/${itemSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-item-${itemSlug}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Item Not Found",
		});
	}
	const data: MetadataData = await response.json();
	return assembleMetadata({
		title: data.title,
		description: data.description,
		icon: data.icon,
		ogImage: {
			url: data.ogImage,
		},
		route: `/items/${itemSlug}`,
	});
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
