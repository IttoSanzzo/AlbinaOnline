import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import SpellsPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Spells",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/spells"),
	},
};

export default async function SpellsPageServerShell() {
	return <SpellsPageContent />;
}
