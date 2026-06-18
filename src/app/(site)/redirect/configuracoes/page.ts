"use client";

import { useCurrentUser } from "@/libs/stp@hooks";
import { redirect } from "next/navigation";

export default function NotionLinkRedirection() {
	const { loading, user } = useCurrentUser();

	if (loading) return null;
	if (!user) redirect("/");
	redirect(`/users/${user.username}/configuracoes`);
}
