import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditSkillPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Skill",
	icon: getAlbinaApiFullAddress("/favicon/core-page/skills"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/skills"),
	},
});

interface EditSkillPageServerShellProps {
	params: Promise<{ skillSlug: string }>;
}
export default async function EditSkillPageServerShell({
	params,
}: EditSkillPageServerShellProps) {
	const { skillSlug } = await params;
	const response = await fetch(getAlbinaApiFullAddress(`/skills/${skillSlug}`));
	if (!response.ok) return <></>;
	return <EditSkillPageContent skill={await response.json()} />;
}
