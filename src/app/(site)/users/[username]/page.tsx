"use client";

import {
	GenericPageContainer,
	StyledLink,
	StyledLinkCard,
} from "@/components/(Design)";
import {
	NotionBox,
	NotionHeader,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { Carousel } from "@/components/(UTILS)";
import { useCurrentUser, useUserFavorites } from "@/libs/stp@hooks";
import { useLayoutEffect, useState } from "react";
import { UserFavoriteCarousel } from "./configuracoes/subComponents/UserFavoriteCarousel";

interface UserPageProps {
	params: Promise<{
		username: string;
	}>;
}

export default function UserPage({ params }: UserPageProps) {
	const [usernameParam, setUsernameParam] = useState<string | null>(null);
	const { loading, user } = useCurrentUser();
	const { favorites, isLoading } = useUserFavorites();

	useLayoutEffect(() => {
		params.then((paramStore) => setUsernameParam(paramStore.username));
	}, [params]);
	if (
		usernameParam == null ||
		loading == true ||
		user == null ||
		isLoading == true ||
		favorites == null
	)
		return null;

	//console.log(favorites.character[0].target);

	return (
		<GenericPageContainer
			title={user.nickname}
			banner={user.bannerUrl}
			icon={user.iconUrl}>
			<>
				<UserFavoriteCarousel
					favoriteType="character"
					favorites={favorites}
					routeBase="chars"
				/>
				<UserFavoriteCarousel
					favoriteType="item"
					favorites={favorites}
					routeBase="items"
				/>
				<UserFavoriteCarousel
					favoriteType="mastery"
					favorites={favorites}
					routeBase="maestrias"
				/>
				<UserFavoriteCarousel
					favoriteType="skill"
					favorites={favorites}
					routeBase="skills"
				/>
				<UserFavoriteCarousel
					favoriteType="spell"
					favorites={favorites}
					routeBase="spells"
				/>
				<UserFavoriteCarousel
					favoriteType="trait"
					favorites={favorites}
					routeBase="tracos"
				/>
				<UserFavoriteCarousel
					favoriteType="race"
					favorites={favorites}
					routeBase="racas"
				/>
			</>
			<NotionHeader textAlign="center">
				<br />
				<StyledLink
					title={"Editar Perfil"}
					href={"#"}
				/>
			</NotionHeader>
		</GenericPageContainer>
	);
}
