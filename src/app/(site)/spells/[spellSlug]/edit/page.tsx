import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditSpellPageContent } from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Spell",
	icon: getAlbinaApiFullAddress("/favicon/spells/slug/edit"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/spells"),
	},
});

interface EditSpellPageServerShellProps {
	params: Promise<{ spellSlug: string }>;
}
export default async function EditSpellPageServerShell({
	params,
}: EditSpellPageServerShellProps) {
	const { spellSlug } = await params;
	const response = await fetch(getAlbinaApiFullAddress(`/spells/${spellSlug}`));
	if (!response.ok) return redirect("/spells");
	return <EditSpellPageContent spell={await response.json()} />;
}
