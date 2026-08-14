import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { redirect } from "next/navigation";

export const metadata: Metadata = assembleMetadata({
	title: "Edit Creature",
	icon: getAlbinaApiFullAddress("/favicon/atlas/slug/edit"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/bestiary"),
	},
	route: "/bestiary",
});

interface EditPageProps {
	params: Promise<{ creatureSlug: string }>;
}
export default async function EditPage({ params }: EditPageProps) {
	const { creatureSlug } = await params;
	const response = await fetch(
		getAlbinaApiFullAddress(`/bestiary/${creatureSlug}`),
		{
			next: { tags: ["/bestiary"] },
		},
	);
	if (!response.ok) return redirect("/bestiary");
	return <PageView creature={await response.json()} />;
}
