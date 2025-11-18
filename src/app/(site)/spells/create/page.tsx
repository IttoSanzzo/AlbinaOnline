import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateSpellPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Create Spell",
	icon: getAlbinaApiFullAddress("/favicon/core-page/spells"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/spells"),
	},
	route: "/spells/create",
});

export default async function CreateSpellPageServerShell() {
	return <CreateSpellPageContent />;
}
