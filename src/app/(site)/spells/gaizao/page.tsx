import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import GaizaoPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Gaizao",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/spells/gaizao"),
	},
};

export default async function GaizaoPageServerShell() {
	return <GaizaoPageContent />;
}
