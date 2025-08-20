import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import AufbringenPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Aufbringen",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/aufbringen"),
	},
};

export default async function AufbringenPageServerShell() {
	return <AufbringenPageContent />;
}
