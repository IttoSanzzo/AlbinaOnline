import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateRacePageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Create Race",
	icon: getAlbinaApiFullAddress("/favicon/core-page/races"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/races"),
	},
	route: "/racas/create",
});

export default async function CreateRacePageServerShell() {
	return <CreateRacePageContent />;
}
