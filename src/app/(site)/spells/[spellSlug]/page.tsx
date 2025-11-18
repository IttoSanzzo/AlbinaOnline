import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import SpellPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface SpellPageServerShellProps {
	params: Promise<{ spellSlug: string }>;
}

export async function generateMetadata({
	params,
}: SpellPageServerShellProps): Promise<Metadata> {
	const { spellSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/spells/${spellSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-spell-${spellSlug}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Spell Not Found",
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
		route: `/spells/${spellSlug}`,
	});
}

export default async function SpellPageServerShell({
	params,
}: SpellPageServerShellProps) {
	const { spellSlug } = await params;

	return <SpellPageContent spellSlug={spellSlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("spells");
}
