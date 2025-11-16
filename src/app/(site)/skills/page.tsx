import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import SkillsPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Skills",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/skills"),
	},
};

export default async function SkillsPageServerShell() {
	return <SkillsPageContent />;
}
