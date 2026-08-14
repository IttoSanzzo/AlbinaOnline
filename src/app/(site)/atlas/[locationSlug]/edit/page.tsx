import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditLocationPageView } from "./page.view";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Location",
	icon: getAlbinaApiFullAddress("/favicon/atlas/slug/edit"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/atlas"),
	},
	route: "/atlas",
});

interface EditLocationPageServerShellProps {
	params: Promise<{ locationSlug: string }>;
}
export default async function EditLocationPageServerShell({
	params,
}: EditLocationPageServerShellProps) {
	const { locationSlug } = await params;
	const response = await fetch(
		getAlbinaApiFullAddress(`/atlas/${locationSlug}`),
		{
			next: { tags: ["/atlas"] },
		},
	);
	if (!response.ok) return redirect("/atlas");
	return <EditLocationPageView location={await response.json()} />;
}
