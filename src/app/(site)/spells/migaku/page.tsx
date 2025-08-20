import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import MigakuPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Migaku",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/migaku"),
	},
};

export default async function MigakuPageServerShell() {
	return <MigakuPageContent />;
}
