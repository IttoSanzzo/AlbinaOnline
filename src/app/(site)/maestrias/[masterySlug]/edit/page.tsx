import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditMasteryPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Mastery",
	icon: getAlbinaApiFullAddress("/favicon/maestrias/slug/edit"),
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
		getAlbinaApiFullAddress(`/masteries/${masterySlug}`),
	);
	if (!response.ok) return redirect("/maestrias");
	return <EditMasteryPageContent mastery={await response.json()} />;
}
