import { Metadata } from "next";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import SkillPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";

interface SkillPageServerShellProps {
	params: Promise<{ skillSlug: string }>;
}

export async function generateMetadata({
	params,
}: SkillPageServerShellProps): Promise<Metadata> {
	const { skillSlug } = await params;

	const response = await fetch(
		getAlbinaApiAddress(`/skills/${skillSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-skill-${skillSlug}`],
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

export default async function SkillPageServerShell({
	params,
}: SkillPageServerShellProps) {
	const { skillSlug } = await params;

	return <SkillPageContent skillSlug={skillSlug} />;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return await fetchStaticParamSlugs("skills");
}
