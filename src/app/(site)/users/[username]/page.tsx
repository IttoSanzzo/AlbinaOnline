"use client";

import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { Carousel } from "@/components/(UTILS)";
import { useCurrentUser, useUserFavorites } from "@/libs/stp@hooks";
import { useLayoutEffect, useState } from "react";

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

	console.log(favorites.Mastery[0].target);

	return (
		<GenericPageContainer
			title={user.nickname}
			banner={user.bannerUrl}
			icon={user.iconUrl}>
			<div>
				<strong>{user.nickname}</strong>
				<span>{user.username}</span>
			</div>

			<>
				<NotionBox backgroundColor="purple">
					<NotionHeader
						textAlign="center"
						backgroundColor={"green"}
						headerType="h4"
						children="Maestrias"
					/>
					<Carousel
						slidesOrigin={"center"}
						slidesSpacing={10}
						minWidth={50}
						slideChilds={favorites.Mastery.map((masteryFavorite) => (
							<StyledLinkCard
								size={50}
								key={masteryFavorite.target.id}
								href={`/maestrias/${masteryFavorite.target.slug}`}
								title={masteryFavorite.target.name}
								artworkUrl={masteryFavorite.target.iconUrl}
							/>
						))}
					/>
				</NotionBox>
				<NotionBox backgroundColor="purple">
					<NotionHeader
						textAlign="center"
						backgroundColor={"green"}
						headerType="h4"
						children="Maestrias"
					/>
					<Carousel
						slidesOrigin={"center"}
						slidesSpacing={10}
						minWidth={150}
						slideChilds={favorites.Mastery.map((masteryFavorite) => (
							<StyledLinkCard
								key={masteryFavorite.target.id}
								href={`/maestrias/${masteryFavorite.target.slug}`}
								title={masteryFavorite.target.name}
								artworkUrl={masteryFavorite.target.iconUrl}
							/>
						))}
					/>
				</NotionBox>
				<NotionBox backgroundColor="purple">
					<NotionHeader
						textAlign="center"
						backgroundColor={"green"}
						headerType="h4"
						children="Maestrias"
					/>
					<Carousel
						slidesOrigin={"center"}
						slidesSpacing={10}
						minWidth={150}
						slideChilds={favorites.Mastery.map((masteryFavorite) => (
							<StyledLinkCard
								key={masteryFavorite.target.id}
								href={`/maestrias/${masteryFavorite.target.slug}`}
								title={masteryFavorite.target.name}
								artworkUrl={masteryFavorite.target.iconUrl}
							/>
						))}
					/>
				</NotionBox>
			</>
		</GenericPageContainer>
	);
}
