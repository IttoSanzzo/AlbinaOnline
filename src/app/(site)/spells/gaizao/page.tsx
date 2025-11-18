import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import GaizaoPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Gaizao",
	icon: getAlbinaApiFullAddress("/favicon/spells/gaizao"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/gaizao"),
	},
	route: "/spells/gaizao",
});

export default async function GaizaoPageServerShell() {
	return <GaizaoPageContent />;
}
