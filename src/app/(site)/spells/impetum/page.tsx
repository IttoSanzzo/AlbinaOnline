import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import ImpetumPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Impetum",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/impetum"),
	},
};

export default async function ImpetumPageServerShell() {
	return <ImpetumPageContent />;
}
