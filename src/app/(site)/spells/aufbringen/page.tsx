import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import AufbringenPageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Aufbringen",
	icon: getAlbinaApiFullAddress("/favicon/spells/aufbringen"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/spells/aufbringen"),
	},
	route: "/spells/aufbringen",
});

export default async function AufbringenPageServerShell() {
	return <AufbringenPageContent />;
}
