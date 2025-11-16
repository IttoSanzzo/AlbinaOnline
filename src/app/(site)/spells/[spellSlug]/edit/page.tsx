import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { EditSpellPageContent } from "./pageContent";

export const metadata: Metadata = {
	title: "Edit Spell",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/spells"),
	},
};

interface EditSpellPageServerShellProps {
	params: Promise<{ spellSlug: string }>;
}
export default async function EditSpellPageServerShell({
	params,
}: EditSpellPageServerShellProps) {
	const { spellSlug } = await params;
	const response = await fetch(getAlbinaApiFullAddress(`/spells/${spellSlug}`));
	if (!response.ok) return <></>;
	return <EditSpellPageContent spell={await response.json()} />;
}
