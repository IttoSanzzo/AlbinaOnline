import { Metadata } from "next";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import TraitPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";

interface TraitPageServerShellProps {
	params: Promise<{ traitSlug: string }>;
}

export async function generateMetadata({
	params,
}: TraitPageServerShellProps): Promise<Metadata> {
	const { traitSlug } = await params;

	const response = await fetch(
		getAlbinaApiAddress(`/traits/${traitSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-trait-${traitSlug}`],
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
