import { Metadata } from "next";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import SpellPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";

interface SpellPageServerShellProps {
	params: Promise<{ spellSlug: string }>;
}

export async function generateMetadata({
	params,
}: SpellPageServerShellProps): Promise<Metadata> {
	const { spellSlug } = await params;

	const response = await fetch(
		getAlbinaApiAddress(`/spells/${spellSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-spell-${spellSlug}`],
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
