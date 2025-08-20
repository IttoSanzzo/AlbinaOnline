import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditRacePageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Edit Race",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/races"),
	},
};

interface EditRacePageServerShellProps {
	params: Promise<{ raceSlug: string }>;
}
export default async function EditRacePageServerShell({
	params,
}: EditRacePageServerShellProps) {
	const { raceSlug } = await params;
	const response = await fetch(getAlbinaApiAddress(`/races/${raceSlug}`));
	if (!response.ok) return <></>;
	return <EditRacePageContent race={await response.json()} />;
}
