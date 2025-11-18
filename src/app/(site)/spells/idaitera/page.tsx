import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import IdaiteraPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Idaitera",
	icon: getAlbinaApiFullAddress("/favicon/spells/idaitera"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/idaitera"),
	},
	route: "/spells/idaitera",
});

export default async function IdaiteraPageServerShell() {
	return <IdaiteraPageContent />;
}
