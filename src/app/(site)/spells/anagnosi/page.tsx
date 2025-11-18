import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import AnagnosiPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Anagnosi",
	icon: getAlbinaApiFullAddress("/favicon/spells/anagnosi"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/anagnosi"),
	},
	route: "/spells/anagnosi",
});

export default async function AnagnosiPageServerShell() {
	return <AnagnosiPageContent />;
}
