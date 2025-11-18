import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import TraitsPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Traços",
	icon: getAlbinaApiFullAddress("/favicon/core-page/tracos"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/tracos"),
	},
	route: "/tracos",
});

export default async function TraitsPageServerShell() {
	return <TraitsPageContent />;
}
