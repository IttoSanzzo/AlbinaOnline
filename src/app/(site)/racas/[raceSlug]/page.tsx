import { Metadata } from "next";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import RacePageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";

interface RacePageServerShellProps {
	params: Promise<{ raceSlug: string }>;
}

export async function generateMetadata({
	params,
}: RacePageServerShellProps): Promise<Metadata> {
	const { raceSlug } = await params;

	const response = await fetch(
		getAlbinaApiAddress(`/races/${raceSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-race-${raceSlug}`],
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
