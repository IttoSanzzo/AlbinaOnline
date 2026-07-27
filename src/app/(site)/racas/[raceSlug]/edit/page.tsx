import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditRacePageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Race",
	icon: getAlbinaApiFullAddress("/favicon/races/slug/edit"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/races"),
	},
});

interface EditRacePageServerShellProps {
	params: Promise<{ raceSlug: string }>;
}
export default async function EditRacePageServerShell({
	params,
}: EditRacePageServerShellProps) {
	const { raceSlug } = await params;
	const response = await fetch(getAlbinaApiFullAddress(`/races/${raceSlug}`));
	if (!response.ok) return redirect("/racas");
	return <EditRacePageContent race={await response.json()} />;
}
