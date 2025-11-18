import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import RacePageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface RacePageServerShellProps {
	params: Promise<{ raceSlug: string }>;
}

export async function generateMetadata({
	params,
}: RacePageServerShellProps): Promise<Metadata> {
	const { raceSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/races/${raceSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-race-${raceSlug}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Race Not Found",
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
		route: `/racas/${raceSlug}`,
	});
}

export default async function RacePageServerShell({
	params,
}: RacePageServerShellProps) {
	const { raceSlug } = await params;

	return <RacePageContent raceSlug={raceSlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("races");
}
