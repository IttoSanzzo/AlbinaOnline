import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditRacePageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Race",
	icon: getAlbinaApiFullAddress("/favicon/core-page/races"),
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
	if (!response.ok) return <></>;
	return <EditRacePageContent race={await response.json()} />;
}
