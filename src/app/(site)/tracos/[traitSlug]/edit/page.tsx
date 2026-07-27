import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditTraitPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Trait",
	icon: getAlbinaApiFullAddress("/favicon/traits/slug/edit"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/traits"),
	},
});

interface EditTraitPageServerShellProps {
	params: Promise<{ traitSlug: string }>;
}
export default async function EditTraitPageServerShell({
	params,
}: EditTraitPageServerShellProps) {
	const { traitSlug } = await params;
	const response = await fetch(getAlbinaApiFullAddress(`/traits/${traitSlug}`));
	if (!response.ok) return redirect("/tracos");
	return <EditTraitPageContent trait={await response.json()} />;
}
