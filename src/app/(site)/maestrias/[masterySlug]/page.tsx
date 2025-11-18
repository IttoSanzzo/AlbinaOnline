import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import MasteryPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface MasteryPageServerShellProps {
	params: Promise<{ masterySlug: string }>;
}

export async function generateMetadata({
	params,
}: MasteryPageServerShellProps): Promise<Metadata> {
	const { masterySlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/masteries/${masterySlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-mastery-${masterySlug}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Mastery Not Found",
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
		route: `/maestrias/${masterySlug}`,
	});
}

export default async function MasteryPageServerShell({
	params,
}: MasteryPageServerShellProps) {
	const { masterySlug } = await params;

	return <MasteryPageContent masterySlug={masterySlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("masteries");
}
