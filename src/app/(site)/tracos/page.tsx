import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import TraitsPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Traits",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/traits"),
	},
};

export default async function TraitsPageServerShell() {
	return <TraitsPageContent />;
}
