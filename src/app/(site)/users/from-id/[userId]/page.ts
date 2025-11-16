import { Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ userId: Guid }>;
}
export default async function Page({ params }: PageProps) {
	const { userId } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/users/id/${userId}/username`),
		{
			cache: "force-cache",
		}
	);
	if (!response.ok) redirect("/not-found");
	const data = await response.json();
	redirect(`/users/${data.username}`);
}
