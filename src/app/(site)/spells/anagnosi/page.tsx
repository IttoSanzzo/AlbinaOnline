import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import AnagnosiPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Anagnosi",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/spells/anagnosi"),
	},
};

export default async function AnagnosiPageServerShell() {
	return <AnagnosiPageContent />;
}
