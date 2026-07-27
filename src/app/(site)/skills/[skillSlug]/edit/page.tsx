import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditSkillPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Skill",
	icon: getAlbinaApiFullAddress("/favicon/skills/slug/edit"),
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
	if (!response.ok) return redirect("/skills");
	return <EditSkillPageContent skill={await response.json()} />;
}
