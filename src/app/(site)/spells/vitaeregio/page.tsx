import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import VitaeregioPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Vitaeregio",
	icon: getAlbinaApiFullAddress("/favicon/spells/vitaeregio"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/vitaeregio"),
	},
	route: "/spells/vitaeregio",
});

export default async function VitaeregioPageServerShell() {
	return <VitaeregioPageContent />;
}
