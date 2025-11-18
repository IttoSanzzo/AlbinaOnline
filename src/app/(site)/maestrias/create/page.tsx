import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateMasteryPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Create Mastery",
	icon: getAlbinaApiFullAddress("/favicon/core-page/maestrias"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/maestrias"),
	},
	route: "/maestrias/create",
});

export default async function CreateMasteryPageServerShell() {
	return <CreateMasteryPageContent />;
}
