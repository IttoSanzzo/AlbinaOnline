import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import TraitsPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Traços",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/traits"),
	},
};

export default async function TraitsPageServerShell() {
	return <TraitsPageContent />;
}
