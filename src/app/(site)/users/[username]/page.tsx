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

	console.log(favorites.character);

	return (
		<GenericPageContainer
			title={user.nickname}
			banner={user.bannerUrl}
			icon={user.iconUrl}>
			<>
				<NotionBox backgroundColor="purple">
					<NotionToggleHeader
						title="Characters"
						titleAlign="left"
						children={
							<Carousel
								slidesOrigin={"center"}
								slidesSpacing={10}
								minWidth={150}
								slideChilds={favorites.mastery.map((masteryFavorite) => (
									<StyledLinkCard
										key={masteryFavorite.target.id}
										href={`/maestrias/${masteryFavorite.target.slug}`}
										title={masteryFavorite.target.name}
										artworkUrl={masteryFavorite.target.iconUrl}
									/>
								))}
							/>
						}
					/>
				</NotionBox>
				<NotionBox backgroundColor="purple">
					<NotionToggleHeader
						title="Itens"
						titleAlign="left"
						children={
							<Carousel
								slidesOrigin={"center"}
								slidesSpacing={10}
								minWidth={150}
								slideChilds={favorites.item.map((ItemFavorite) => (
									<StyledLinkCard
										size={150}
										key={ItemFavorite.target.id}
										href={`/items/${ItemFavorite.target.slug}`}
										title={ItemFavorite.target.name}
										artworkUrl={ItemFavorite.target.iconUrl}
									/>
								))}
							/>
						}
					/>
				</NotionBox>

				<NotionBox backgroundColor="purple">
					<NotionToggleHeader
						title="Maestrias"
						titleAlign="left"
						children={
							<Carousel
								slidesOrigin={"center"}
								slidesSpacing={10}
								minWidth={150}
								slideChilds={favorites.mastery.map((masteryFavorite) => (
									<StyledLinkCard
										key={masteryFavorite.target.id}
										href={`/maestrias/${masteryFavorite.target.slug}`}
										title={masteryFavorite.target.name}
										artworkUrl={masteryFavorite.target.iconUrl}
									/>
								))}
							/>
						}
					/>
				</NotionBox>

				<NotionBox backgroundColor="purple">
					<NotionToggleHeader
						title="Skills"
						titleAlign="left"
						children={
							<Carousel
								slidesOrigin={"center"}
								slidesSpacing={10}
								minWidth={150}
								slideChilds={favorites.skill.map((SkillsFavorite) => (
									<StyledLinkCard
										key={SkillsFavorite.target.id}
										href={`/skills/${SkillsFavorite.target.slug}`}
										title={SkillsFavorite.target.name}
										artworkUrl={SkillsFavorite.target.iconUrl}
									/>
								))}
							/>
						}
					/>
				</NotionBox>

				<NotionBox backgroundColor="purple">
					<NotionToggleHeader
						title="Spell"
						titleAlign="left"
						children={
							<Carousel
								slidesOrigin={"center"}
								slidesSpacing={10}
								minWidth={150}
								slideChilds={favorites.spell.map((SpellsFavorite) => (
									<StyledLinkCard
										key={SpellsFavorite.target.id}
										href={`/spells/${SpellsFavorite.target.slug}`}
										title={SpellsFavorite.target.name}
										artworkUrl={SpellsFavorite.target.iconUrl}
									/>
								))}
							/>
						}
					/>
				</NotionBox>

				<NotionBox backgroundColor="purple">
					<NotionToggleHeader
						title="Traços"
						titleAlign="left"
						children={
							<Carousel
								slidesOrigin={"center"}
								slidesSpacing={10}
								minWidth={150}
								slideChilds={favorites.trait.map((TraitFavorite) => (
									<StyledLinkCard
										key={TraitFavorite.target.id}
										href={`/tracos/${TraitFavorite.target.slug}`}
										title={TraitFavorite.target.name}
										artworkUrl={TraitFavorite.target.iconUrl}
									/>
								))}
							/>
						}
					/>
				</NotionBox>

				<NotionBox backgroundColor="purple">
					<NotionToggleHeader
						title="Raças"
						titleAlign="left"
						children={
							<Carousel
								slidesOrigin={"center"}
								slidesSpacing={10}
								minWidth={150}
								slideChilds={favorites.race.map((RaceFavorite) => (
									<StyledLinkCard
										key={RaceFavorite.target.id}
										href={`/racas/${RaceFavorite.target.slug}`}
										title={RaceFavorite.target.name}
										artworkUrl={RaceFavorite.target.iconUrl}
									/>
								))}
							/>
						}
					/>
				</NotionBox>
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
