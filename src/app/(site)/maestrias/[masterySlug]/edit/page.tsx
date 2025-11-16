import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditMasteryPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Edit Mastery",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/masteries"),
	},
};

interface EditMasteryPageServerShellProps {
	params: Promise<{ masterySlug: string }>;
}
export default async function EditMasteryPageServerShell({
	params,
}: EditMasteryPageServerShellProps) {
	const { masterySlug } = await params;
	const response = await fetch(
		getAlbinaApiFullAddress(`/masteries/${masterySlug}`)
	);
	if (!response.ok) return null;
	return <EditMasteryPageContent mastery={await response.json()} />;
}
