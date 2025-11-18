import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import KhranitelPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Khranitel",
	icon: getAlbinaApiFullAddress("/favicon/spells/khranitel"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/khranitel"),
	},
	route: "/spells/khranitel",
});

export default async function KhranitelPageServerShell() {
	return <KhranitelPageContent />;
}
