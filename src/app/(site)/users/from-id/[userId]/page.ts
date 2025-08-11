import { Guid } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ userId: Guid }>;
}
export default async function Page({ params }: PageProps) {
	const { userId } = await params;

	const response = await fetch(
		getAlbinaApiAddress(`/users/id/${userId}/username`),
		{
			cache: "force-cache",
		}
	);
	if (!response.ok) redirect("/not-found");
	const data = await response.json();
	redirect(`/users/${data.username}`);
}
