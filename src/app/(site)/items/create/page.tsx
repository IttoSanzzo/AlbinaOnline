import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateItemPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Create Item",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/items"),
	},
};

export default async function CreateItemPageServerShell() {
	return <CreateItemPageContent />;
}
