import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateMasteryPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Create Mastery",
	icon: getAlbinaApiFullAddress("/favicon/core-page/masteries"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/masteries"),
	},
	route: "/masteries/create",
});

export default async function CreateMasteryPageServerShell() {
	return <CreateMasteryPageContent />;
}
