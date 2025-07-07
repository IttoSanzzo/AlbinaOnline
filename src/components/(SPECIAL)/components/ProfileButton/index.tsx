"use client";

import Image from "next/image";
import { ProfileButtonContainer } from "./styledElements";
import { useCurrentUser } from "@/libs/stp@hooks";

export function ProfileButton() {
	const { user, reloadUser } = useCurrentUser();

	if (!user) return <ProfileButtonContainer />;
	return (
		<ProfileButtonContainer>
			<Image
				src={user.iconUrl}
				alt="Profile image"
				width={32}
				height={32}
				priority
			/>
		</ProfileButtonContainer>
	);
}
