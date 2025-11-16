import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import MigakuPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Migaku",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/spells/migaku"),
	},
};

export default async function MigakuPageServerShell() {
	return <MigakuPageContent />;
}
