import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditLocationPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Location",
	icon: getAlbinaApiFullAddress("/favicon/atlas/slug/edit"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/atlas"),
	},
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
	);
	if (!response.ok) return redirect("/atlas");
	return <EditLocationPageContent location={await response.json()} />;
}
