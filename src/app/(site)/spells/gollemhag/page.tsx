import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import GollemhagPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Gollemhag",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/gollemhag"),
	},
};

export default async function GollemhagPageServerShell() {
	return <GollemhagPageContent />;
}
