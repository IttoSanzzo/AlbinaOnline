import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import ImpetumPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Impetum",
	icon: getAlbinaApiFullAddress("/favicon/spells/impetum"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/impetum"),
	},
	route: "/spells/impetum",
});

export default async function ImpetumPageServerShell() {
	return <ImpetumPageContent />;
}
