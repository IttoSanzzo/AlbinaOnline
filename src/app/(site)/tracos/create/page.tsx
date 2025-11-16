import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { CreateTraitPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Create Trait",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/traits"),
	},
};

export default async function CreateTraitPageServerShell() {
	return <CreateTraitPageContent />;
}
