import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditMasteryPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Mastery",
	icon: getAlbinaApiFullAddress("/favicon/core-page/maestrias"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/maestrias"),
	},
});

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
