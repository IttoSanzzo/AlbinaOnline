import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import MasteriesPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Maestrias",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/maestrias"),
	},
};

export default async function MasteriesPageServerShell() {
	return <MasteriesPageContent />;
}
