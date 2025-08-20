import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import VerstandPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Verstand",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/verstand"),
	},
};

export default async function VerstandPageServerShell() {
	return <VerstandPageContent />;
}
