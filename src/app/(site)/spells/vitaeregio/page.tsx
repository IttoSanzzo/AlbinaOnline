import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import VitaeregioPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Vitaeregio",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/vitaeregio"),
	},
};

export default async function VitaeregioPageServerShell() {
	return <VitaeregioPageContent />;
}
