import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditSkillPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Edit Skill",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/skills"),
	},
};

interface EditSkillPageServerShellProps {
	params: Promise<{ skillSlug: string }>;
}
export default async function EditSkillPageServerShell({
	params,
}: EditSkillPageServerShellProps) {
	const { skillSlug } = await params;
	const response = await fetch(getAlbinaApiAddress(`/skills/${skillSlug}`));
	if (!response.ok) return <></>;
	return <EditSkillPageContent skill={await response.json()} />;
}
