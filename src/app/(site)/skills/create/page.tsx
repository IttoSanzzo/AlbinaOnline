import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateSkillPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Create Skill",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/skills"),
	},
};

export default async function CreateSkillPageServerShell() {
	return <CreateSkillPageContent />;
}
