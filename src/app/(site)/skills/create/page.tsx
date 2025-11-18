import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateSkillPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Create Skill",
	icon: getAlbinaApiFullAddress("/favicon/core-page/skills"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/skills"),
	},
	route: "/skills/create",
});

export default async function CreateSkillPageServerShell() {
	return <CreateSkillPageContent />;
}
