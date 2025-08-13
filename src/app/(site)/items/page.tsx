import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import ItemsPageContent from "./pageContent";

export const metadata: Metadata = {
	title: "Items",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/items"),
	},
};

export default async function ItemsPageServerShell() {
	return <ItemsPageContent />;
}
