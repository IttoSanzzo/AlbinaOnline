import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import KhranitelPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Khranitel",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/spells/khranitel"),
	},
};

export default async function KhranitelPageServerShell() {
	return <KhranitelPageContent />;
}
