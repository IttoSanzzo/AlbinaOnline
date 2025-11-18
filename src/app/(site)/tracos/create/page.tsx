import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateTraitPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Create Trait",
	icon: getAlbinaApiFullAddress("/favicon/core-page/traits"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/traits"),
	},
	route: "/tracos/create",
});

export default async function CreateTraitPageServerShell() {
	return <CreateTraitPageContent />;
}
