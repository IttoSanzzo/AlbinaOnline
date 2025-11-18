import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import VerstandPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Verstand",
	icon: getAlbinaApiFullAddress("/favicon/spells/verstand"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/verstand"),
	},
	route: "/spells/verstand",
});

export default async function VerstandPageServerShell() {
	return <VerstandPageContent />;
}
