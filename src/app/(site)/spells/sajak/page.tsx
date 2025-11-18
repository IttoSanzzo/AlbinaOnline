import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import SajakPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Sajak",
	icon: getAlbinaApiFullAddress("/favicon/spells/sajak"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/sajak"),
	},
	route: "/spells/sajak",
});

export default async function SajakPageServerShell() {
	return <SajakPageContent />;
}
