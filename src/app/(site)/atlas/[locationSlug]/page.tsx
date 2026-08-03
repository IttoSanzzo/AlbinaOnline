import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";
import PageView from "./page.view";

interface LocationPageServerShellProps {
	params: Promise<{ locationSlug: string }>;
}

export async function generateMetadata({
	params,
}: LocationPageServerShellProps): Promise<Metadata> {
	const { locationSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/atlas/${locationSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: { tags: [`/atlas`] },
		},
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Location Not Found",
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
		route: `/atlas/${locationSlug}`,
	});
}

export default async function ItemPageServerShell({
	params,
}: LocationPageServerShellProps) {
	const { locationSlug } = await params;

	return <PageView locationSlug={locationSlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("atlas");
}
