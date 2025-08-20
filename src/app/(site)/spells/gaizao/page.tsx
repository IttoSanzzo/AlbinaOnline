import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import GaizaoPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Gaizao",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/gaizao"),
	},
};

export default async function GaizaoPageServerShell() {
	return <GaizaoPageContent />;
}
