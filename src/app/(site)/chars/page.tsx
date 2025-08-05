"use client";

import { GenericPageContainer, StyledLinkCard } from "@/components/(Design)";
import { StyledOwnedLinkCard } from "@/components/(Design)/components/StyledOwnedLinkCard";
import { Carousel, NotionGridList } from "@/components/(UTILS)";
import {
	SetNavBarModules,
	useCurrentUser,
	useUserFavorites,
} from "@/libs/stp@hooks";
import { CharacterData } from "@/libs/stp@types";
import { routeInfra } from "./(routeInfra)";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";

export default function Characters() {
	const [rawCharacters, setRawCharacters] = useState<CharacterData[] | null>(
		null
	);
	const { favorites, isLoading } = useUserFavorites();
	const currentUser = useCurrentUser();

	useEffect(() => {
		authenticatedFetchAsync(`${getAlbinaApiAddress()}/chars`, {
			cache: "no-cache",
		}).then((response) => {
			response.json().then((data) => setRawCharacters(data.characters));
		});
	}, [setRawCharacters]);
	if (rawCharacters === null) return null;
	const allCharacters: CharacterData[] = [...rawCharacters].sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	const allFavoriteCharacters: CharacterData[] = isLoading
		? []
		: favorites?.character.flatMap((favorite) => {
				const character = allCharacters.find(
					(character) => character.id == favorite.target.id
				);
				return character ? [character] : [];
		  }) ?? [];
	const allUserCharacters: CharacterData[] = currentUser.loading
		? []
		: allCharacters.filter(
				(character) => character.ownerId == currentUser.user?.id
		  );

	return (
		<GenericPageContainer
			title="Todos os Chars"
			icon={`${getAlbinaApiAddress()}/favicon/core-page/characters`}
			banner={`${getAlbinaApiAddress()}/banner/core-page/characters`}>
			<SetNavBarModules contextMenuButton={routeInfra.PageContextMenu} />

			{allCharacters.length !== 0 && (
				<NotionBox
					withoutPadding
					backgroundColor="darkGray">
					{allFavoriteCharacters.length !== 0 && (
						<>
							<NotionHeader
								textAlign="center"
								textColor="yellow"
								children={"Seus Favoritos"}
							/>
							<NotionBox backgroundColor="yellow">
								<Carousel
									slidesOrigin={"center"}
									slidesSpacing={10}
									minWidth={150}
									memoryId={"Favorites"}
									slideChilds={allFavoriteCharacters.map((character) => (
										<StyledOwnedLinkCard
											key={character.id}
											ownerId={character.ownerId}
											href={`/chars/${character.id}`}
											title={character.name}
											artworkUrl={character.iconUrl}
										/>
									))}
								/>
							</NotionBox>
						</>
					)}
					{allUserCharacters.length !== 0 && (
						<>
							<NotionHeader
								textAlign="center"
								textColor="purple"
								children={"Seus Personagens"}
							/>
							<NotionBox backgroundColor="purple">
								<Carousel
									slidesOrigin={"center"}
									slidesSpacing={10}
									minWidth={150}
									memoryId={"Owned"}
									slideChilds={allUserCharacters.map((character) => (
										<StyledOwnedLinkCard
											key={character.id}
											ownerId={character.ownerId}
											href={`/chars/${character.id}`}
											title={character.name}
											artworkUrl={character.iconUrl}
										/>
									))}
								/>
							</NotionBox>
						</>
					)}
					<NotionHeader
						textAlign="center"
						textColor="darkGray"
						backgroundColor="darkGray"
						children={"Todos"}
					/>
					<NotionGridList
						direction="row"
						backgroundColor="blue"
						columnWidth={150}>
						{allCharacters.map((character, index) => (
							<StyledOwnedLinkCard
								key={character.id}
								size={150}
								ownerId={character.ownerId}
								href={`/chars/${character.id}`}
								title={character.name}
								artworkUrl={character.iconUrl}
								layout="rectangle"
							/>
						))}
					</NotionGridList>
				</NotionBox>
			)}
		</GenericPageContainer>
	);
}
