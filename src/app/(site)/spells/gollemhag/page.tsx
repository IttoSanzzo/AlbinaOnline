import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import GollemhagPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Gollemhag",
	icon: getAlbinaApiFullAddress("/favicon/spells/gollemhag"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/gollemhag"),
	},
	route: "/spells/gollemhag",
});

export default async function GollemhagPageServerShell() {
	return <GollemhagPageContent />;
}
