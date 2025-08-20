import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import AnagnosiPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Anagnosi",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/anagnosi"),
	},
};

export default async function AnagnosiPageServerShell() {
	return <AnagnosiPageContent />;
}
