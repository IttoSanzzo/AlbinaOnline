import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import RacesPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Raças",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/races"),
	},
};

export default async function RacesPageServerShell() {
	return <RacesPageContent />;
}
