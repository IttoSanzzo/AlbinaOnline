import { Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ creatureId: Guid }>;
}
export default async function Page({ params }: PageProps) {
	const { creatureId } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/bestiary/by-id/${creatureId}`),
	);
	if (!response.ok) redirect("/not-found");
	const data = await response.json();
	redirect(`/bestiario/${data.slug}`);
}
