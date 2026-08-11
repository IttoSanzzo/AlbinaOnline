import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";
import PageView from "./page.view";

interface CreaturePageServerShellProps {
	params: Promise<{ creatureSlug: string }>;
}

export async function generateMetadata({
	params,
}: CreaturePageServerShellProps): Promise<Metadata> {
	const { creatureSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/bestiary/${creatureSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: { tags: [`/bestiary`] },
		},
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Creature Not Found",
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
		route: `/bestiario/${creatureSlug}`,
	});
}

export default async function ItemPageServerShell({
	params,
}: CreaturePageServerShellProps) {
	const { creatureSlug } = await params;

	return <PageView entitySlug={creatureSlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("bestiary");
}
