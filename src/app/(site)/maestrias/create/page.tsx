import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateMasteryPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Create Mastery",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/masteries"),
	},
};

export default async function CreateMasteryPageServerShell() {
	return <CreateMasteryPageContent />;
}
