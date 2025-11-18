import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import RacesPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Raças",
	icon: getAlbinaApiFullAddress("/favicon/core-page/racas"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/racas"),
	},
	route: "/racas",
});

export default async function RacesPageServerShell() {
	return <RacesPageContent />;
}
