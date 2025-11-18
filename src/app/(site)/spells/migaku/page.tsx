import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import MigakuPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Migaku",
	icon: getAlbinaApiFullAddress("/favicon/spells/migaku"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/migaku"),
	},
	route: "/spells/migaku",
});

export default async function MigakuPageServerShell() {
	return <MigakuPageContent />;
}
