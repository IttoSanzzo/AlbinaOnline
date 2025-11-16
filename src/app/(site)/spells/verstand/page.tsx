import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import VerstandPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Verstand",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/spells/verstand"),
	},
};

export default async function VerstandPageServerShell() {
	return <VerstandPageContent />;
}
