import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import IdaiteraPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Idaitera",
	icons: {
		icon: getAlbinaApiAddress("/favicon/spells/idaitera"),
	},
};

export default async function IdaiteraPageServerShell() {
	return <IdaiteraPageContent />;
}
