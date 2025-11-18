import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import SkillsPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Skills",
	icon: getAlbinaApiFullAddress("/favicon/core-page/skills"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/skills"),
	},
	route: "/skills",
});

export default async function SkillsPageServerShell() {
	return <SkillsPageContent />;
}
