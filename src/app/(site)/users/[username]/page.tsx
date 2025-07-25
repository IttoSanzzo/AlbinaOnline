"use client";

import {
	GenericPageContainer,
	StyledLink,
	StyledLinkCard,
} from "@/components/(Design)";
import {
	Notion2Columns,
	NotionBox,
	NotionHeader,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { Carousel } from "@/components/(UTILS)";
import {
	Breadcrumb,
	SetBreadcrumbs,
	useCurrentUser,
	useUserFavorites,
} from "@/libs/stp@hooks";
import { useLayoutEffect, useState } from "react";
import { UserFavoriteCarousel } from "./subComponents/UserFavoriteCarousel";
import { UserFavoriteCarouselContainer } from "./styledElements";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

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
	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/users",
			name: "Users",
			icon: `${getAlbinaApiAddress()}/favicon/users`,
		},
		{
			href: "#",
			name: user.nickname,
			icon: user.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title={user.nickname}
			banner={user.bannerUrl}
			icon={user.iconUrl}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />

			<UserFavoriteCarousel
				favoriteType="character"
				favorites={favorites}
				routeBase="chars"
				favoriteName="Personagens"
			/>

			<Notion2Columns
				colum1={
					<UserFavoriteCarouselContainer>
						<UserFavoriteCarousel
							favoriteType="item"
							favorites={favorites}
							routeBase="items"
							favoriteName="Items"
						/>
						<UserFavoriteCarousel
							favoriteType="mastery"
							favorites={favorites}
							routeBase="maestrias"
							favoriteName="Maestrias"
						/>
						<UserFavoriteCarousel
							favoriteType="skill"
							favorites={favorites}
							routeBase="skills"
							favoriteName="Skills"
						/>
					</UserFavoriteCarouselContainer>
				}
				colum2={
					<UserFavoriteCarouselContainer>
						<UserFavoriteCarousel
							favoriteType="spell"
							favorites={favorites}
							routeBase="spells"
							favoriteName="Spells"
						/>
						<UserFavoriteCarousel
							favoriteType="trait"
							favorites={favorites}
							routeBase="tracos"
							favoriteName="Traços"
						/>
						<UserFavoriteCarousel
							favoriteType="race"
							favorites={favorites}
							routeBase="racas"
							favoriteName="Raças"
						/>
					</UserFavoriteCarouselContainer>
				}
			/>
		</GenericPageContainer>
	);
}
