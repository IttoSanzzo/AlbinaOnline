import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import AffaiblirPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Affaiblir",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/spells/affaiblir"),
	},
};

export default async function AffaiblirPageServerShell() {
	return <AffaiblirPageContent />;
}
