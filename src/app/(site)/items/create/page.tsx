import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateItemPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Create Item",
	icon: getAlbinaApiFullAddress("/favicon/core-page/items"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/items"),
	},
	route: "/items/create",
});

export default async function CreateItemPageServerShell() {
	return <CreateItemPageContent />;
}
