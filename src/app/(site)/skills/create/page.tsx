import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateSkillPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Create Skill",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/skills"),
	},
};

export default async function CreateSkillPageServerShell() {
	return <CreateSkillPageContent />;
}
