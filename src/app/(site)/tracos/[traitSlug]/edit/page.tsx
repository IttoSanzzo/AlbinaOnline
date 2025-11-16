import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditTraitPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Edit Trait",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/traits"),
	},
};

interface EditTraitPageServerShellProps {
	params: Promise<{ traitSlug: string }>;
}
export default async function EditTraitPageServerShell({
	params,
}: EditTraitPageServerShellProps) {
	const { traitSlug } = await params;
	const response = await fetch(getAlbinaApiFullAddress(`/traits/${traitSlug}`));
	if (!response.ok) return <></>;
	return <EditTraitPageContent trait={await response.json()} />;
}
