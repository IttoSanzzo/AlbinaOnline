import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditItemPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Edit Item",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/items"),
	},
};

interface EditItemPageServerShellProps {
	params: Promise<{ itemSlug: string }>;
}
export default async function EditItemPageServerShell({
	params,
}: EditItemPageServerShellProps) {
	const { itemSlug } = await params;
	const response = await fetch(getAlbinaApiAddress(`/items/${itemSlug}`));
	if (!response.ok) return <></>;
	return <EditItemPageContent item={await response.json()} />;
}
