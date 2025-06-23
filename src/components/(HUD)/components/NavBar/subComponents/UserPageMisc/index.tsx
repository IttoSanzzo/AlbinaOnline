"use client";

import { FavoriteButton, ProfileButton } from "@/components/(SPECIAL)";
import {
	ProfileButtonContainer,
	UserPageMiscContainer,
} from "./styledElements";
import { useAuthStore, useCurrentUser } from "@/libs/stp@hooks";

export default function UserPageMisc() {
	const { user, reloadUser } = useCurrentUser();

	return (
		<UserPageMiscContainer>
			<FavoriteButton />
			<ProfileButtonContainer>
				<ProfileButton user={user} />
			</ProfileButtonContainer>
		</UserPageMiscContainer>
	);
}
