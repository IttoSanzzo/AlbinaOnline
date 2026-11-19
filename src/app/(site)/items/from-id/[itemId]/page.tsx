import { Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ itemId: Guid }>;
}
export default async function Page({ params }: PageProps) {
	const { itemId } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/items/by-id/${itemId}`),
	);
	if (!response.ok) redirect("/not-found");
	const data = await response.json();
	redirect(`/items/${data.slug}`);
}
