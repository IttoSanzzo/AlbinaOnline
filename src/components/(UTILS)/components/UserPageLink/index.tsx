"use client";

import { StyledLink } from "@/components/(Design)";
import { FullUser, Guid } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useLayoutEffect, useState } from "react";

interface UserPageLinkProps {
	userId: Guid;
}
export function UserPageLink({ userId }: UserPageLinkProps) {
	const [user, setUser] = useState<FullUser | null>(null);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress(`/users/id/${userId}`), {
			method: "GET",
		}).then(async (response) => {
			if (!response.ok) return;
			const data = await response.json();
			setUser(data.user);
		});
	}, [userId]);
	if (user === null) return null;

	return (
		<StyledLink
			href={`/users/${user.username}`}
			icon={user.iconUrl}
			title={user.nickname}
		/>
	);
}
