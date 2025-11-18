import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import AffaiblirPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Affaiblir",
	icon: getAlbinaApiFullAddress("/favicon/spells/affaiblir"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/affaiblir"),
	},
	route: "/spells/affaiblir",
});

export default async function AffaiblirPageServerShell() {
	return <AffaiblirPageContent />;
}
