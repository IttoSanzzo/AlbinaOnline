import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import SajakPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Sajak",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/spells/sajak"),
	},
};

export default async function SajakPageServerShell() {
	return <SajakPageContent />;
}
