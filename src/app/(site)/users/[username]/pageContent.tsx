"use client";

import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import { useLayoutEffect, useState } from "react";
import { UserFavoriteCarousel } from "./subComponents/UserFavoriteCarousel";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import {
	CharacterData,
	FullUser,
	RoleHierarchy,
	UserFavoritesGrouped,
} from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import Link from "next/link";

const UserFavoriteCarouselContainer = newStyledElement.div(
	styles.UserFavoriteCarouselContainer,
);

interface UserPageContentProps {
	username: string;
}
export default function UserPageContent({ username }: UserPageContentProps) {
	const currentUser = useCurrentUser();
	const [user, setUser] = useState<FullUser | null>(null);
	const [favorites, setFavorites] = useState<UserFavoritesGrouped | null>(null);
	const [userCharacters, setUserCharacters] = useState<CharacterData[] | null>(
		[],
	);

	useLayoutEffect(() => {
		authenticatedFetchAsync(getAlbinaApiFullAddress(`/users/${username}`), {
			method: "GET",
		}).then(async (response) => {
			if (!response.ok) return;
			const data = await response.json();
			setUser(data.user);
			authenticatedFetchAsync(
				`${getAlbinaApiFullAddress()}/users/${
					data.user.username
				}/favorites/grouped`,
				{
					method: "GET",
				},
			).then(async (response) => {
				if (!response.ok) return;
				const data = await response.json();
				setFavorites({
					character: data.favorites.Character,
					item: data.favorites.Item,
					mastery: data.favorites.Mastery,
					race: data.favorites.Race,
					skill: data.favorites.Skill,
					spell: data.favorites.Spell,
					trait: data.favorites.Trait,
				});
			});
			authenticatedFetchAsync(
				getAlbinaApiFullAddress(`/users/${username}/chars`),
				{
					method: "GET",
				},
			).then(async (response) => {
				if (!response.ok) return;
				const data = await response.json();
				setUserCharacters(data.characters);
			});
		});
	}, [username]);
	if (
		user == null ||
		favorites == null ||
		userCharacters == null ||
		currentUser.loading ||
		currentUser.user === null
	)
		return null;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/users",
			name: "Users",
			icon: getAlbinaApiFullAddress("/favicon/users"),
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
			icon={user.iconUrl}
			subTitle={user.role}
			isEditable={
				user.id === currentUser.user.id ||
				RoleHierarchy[currentUser.user.role] >= RoleHierarchy.Admin
			}
			bannerChangeRoute={getAlbinaApiFullAddress(`/users/id/${user.id}/banner`)}
			iconChangeRoute={getAlbinaApiFullAddress(`/users/id/${user.id}/favicon`)}
			titleChangeRoute={getAlbinaApiFullAddress(
				`/users/id/${user.id}/nickname`,
			)}
			titleChangeBodyPropName={"nickname"}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />

			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.Header
					textAlign="center"
					textColor="orange">
					<Link
						style={{ color: StandartTextColor.red }}
						href={"/chars"}>
						Fichas
					</Link>
				</UIBasics.Header>
				<UIBasics.Box
					height={125}
					withoutBorderRadius
					withoutMargin
					backgroundColor="darkGray">
					<UIBasics.Carousel
						slidesOrigin={"center"}
						slidesSpacing={10}
						minWidth={100}
						slideChilds={userCharacters.map((char) => (
							<StyledLinkCard
								size={100}
								key={char.id}
								href={`/chars/${char.id}`}
								title={char.name}
								titleWrap
								artworkUrl={getAlbinaApiFullAddress(
									`/favicon/chars/${char.id}`,
								)}
							/>
						))}
					/>
				</UIBasics.Box>
			</UIBasics.Box>
			<UIBasics.Box
				withoutPadding
				backgroundColor="darkGray"
				withoutBorder>
				<UIBasics.Header
					textAlign="center"
					textColor="orange"
					children={"Favoritos"}
				/>
				<UserFavoriteCarousel
					favoriteType="character"
					favorites={favorites}
					routeBase="chars"
					favoriteName="Personagens"
				/>
				<UIBasics.MultiColumn.Two
					withoutGap
					withoutPadding
					withoutBorderRadius
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
			</UIBasics.Box>
		</GenericPageContainer>
	);
}
