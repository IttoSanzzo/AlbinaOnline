import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditItemPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Item",
	icon: getAlbinaApiFullAddress("/favicon/core-page/items"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/items"),
	},
});

interface EditItemPageServerShellProps {
	params: Promise<{ itemSlug: string }>;
}
export default async function EditItemPageServerShell({
	params,
}: EditItemPageServerShellProps) {
	const { itemSlug } = await params;
	const response = await fetch(getAlbinaApiFullAddress(`/items/${itemSlug}`));
	if (!response.ok) return <></>;
	return <EditItemPageContent item={await response.json()} />;
}
