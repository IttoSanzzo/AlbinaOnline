import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import RacesPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Raças",
	icon: getAlbinaApiFullAddress("/favicon/core-page/races"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/races"),
	},
	route: "/racas",
});

export default async function RacesPageServerShell() {
	return <RacesPageContent />;
}
