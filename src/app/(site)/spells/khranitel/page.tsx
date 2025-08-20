import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import KhranitelPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Khranitel",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/khranitel"),
	},
};

export default async function KhranitelPageServerShell() {
	return <KhranitelPageContent />;
}
