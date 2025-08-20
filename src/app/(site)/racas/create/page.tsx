import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateRacePageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Create Race",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/races"),
	},
};

export default async function CreateRacePageServerShell() {
	return <CreateRacePageContent />;
}
