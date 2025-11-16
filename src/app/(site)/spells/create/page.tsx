import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateSpellPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Create Spell",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/spells"),
	},
};

export default async function CreateSpellPageServerShell() {
	return <CreateSpellPageContent />;
}
