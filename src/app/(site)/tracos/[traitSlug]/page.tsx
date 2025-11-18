import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import TraitPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface TraitPageServerShellProps {
	params: Promise<{ traitSlug: string }>;
}

export async function generateMetadata({
	params,
}: TraitPageServerShellProps): Promise<Metadata> {
	const { traitSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/traits/${traitSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-trait-${traitSlug}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Trait Not Found",
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
		route: `/traits/${traitSlug}`,
	});
}

export default async function TraitPageServerShell({
	params,
}: TraitPageServerShellProps) {
	const { traitSlug } = await params;

	return <TraitPageContent traitSlug={traitSlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("traits");
}
