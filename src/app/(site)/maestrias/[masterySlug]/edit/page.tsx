import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditMasteryPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Edit Mastery",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/masteries"),
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
		getAlbinaApiAddress(`/masteries/${masterySlug}`)
	);
	if (!response.ok) return null;
	return <EditMasteryPageContent mastery={await response.json()} />;
}
