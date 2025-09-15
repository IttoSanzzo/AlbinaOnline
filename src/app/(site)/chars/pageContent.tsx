"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { StyledOwnedLinkCard } from "@/components/(Design)/components/StyledOwnedLinkCard";
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
import { UIBasics } from "@/components/(UIBasics)";

export default function CharsPageContent() {
	const [rawCharacters, setRawCharacters] = useState<CharacterData[] | null>(
		null
	);
	const { favorites, isLoading } = useUserFavorites();
	const currentUser = useCurrentUser();

	useEffect(() => {
		authenticatedFetchAsync(getAlbinaApiAddress("/chars"), {
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
			icon={getAlbinaApiAddress("/favicon/core-page/chars")}
			banner={getAlbinaApiAddress("/banner/core-page/chars")}>
			<SetNavBarModules contextMenuButton={routeInfra.PageContextMenu} />

			{allCharacters.length === 0 && (
				<>
					<UIBasics.Header
						textAlign="center"
						textColor="gray"
						children="Você não possui personagens"
					/>
					<UIBasics.Header
						textAlign="center"
						textColor="gray"
						headerType="h3"
						children="...e nem acesso a algum personagem de outro jogador."
					/>
				</>
			)}
			{allCharacters.length !== 0 && (
				<UIBasics.Box
					withoutPadding
					backgroundColor="darkGray">
					{allFavoriteCharacters.length !== 0 && (
						<>
							<UIBasics.Header
								textAlign="center"
								textColor="yellow"
								children={"Seus Favoritos"}
							/>
							<UIBasics.Box backgroundColor="yellow">
								<UIBasics.Carousel
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
							</UIBasics.Box>
						</>
					)}
					{allUserCharacters.length !== 0 && (
						<>
							<UIBasics.Header
								textAlign="center"
								textColor="purple"
								children={"Seus Personagens"}
							/>
							<UIBasics.Box backgroundColor="purple">
								<UIBasics.Carousel
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
							</UIBasics.Box>
						</>
					)}
					<UIBasics.Header
						textAlign="center"
						textColor="darkGray"
						backgroundColor="darkGray"
						children={"Todos"}
					/>
					<UIBasics.List.Grid
						direction="row"
						backgroundColor="blue"
						columnWidth={150}>
						{allCharacters.map((character) => (
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
					</UIBasics.List.Grid>
				</UIBasics.Box>
			)}
		</GenericPageContainer>
	);
}
