"use client";

import { FavoriteButton, ProfileButton } from "@/components/(SPECIAL)";
import {
	ProfileButtonContainer,
	UserPageMiscContainer,
} from "./styledElements";
import { useAuthStore, useCurrentUser } from "@/libs/stp@hooks";

export default function UserPageMisc() {
	const { user, loading, reloadUser } = useCurrentUser();

	return (
		<UserPageMiscContainer>
			<FavoriteButton user={user} />
			<ProfileButtonContainer>
				<ProfileButton user={user} />
			</ProfileButtonContainer>
		</UserPageMiscContainer>
	);
}
