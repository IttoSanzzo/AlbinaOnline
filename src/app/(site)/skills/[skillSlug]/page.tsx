import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import SkillPageContent from "./pageContent";
import { fetchStaticParamSlugs } from "@/utils/Data";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";
import { assembleMetadata } from "@/metadata/assembleMetadata";

interface SkillPageServerShellProps {
	params: Promise<{ skillSlug: string }>;
}

export async function generateMetadata({
	params,
}: SkillPageServerShellProps): Promise<Metadata> {
	const { skillSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/skills/${skillSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-skill-${skillSlug}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Skill Not Found",
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
		route: `/skills/${skillSlug}`,
	});
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
