"use client";

import { StyledOwnedLinkCard } from "@/components/(Design)/components/StyledOwnedLinkCard";
import { useCurrentUser, useUserFavorites } from "@/libs/stp@hooks";
import { CharacterData } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useEffect, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";

const schema = z.object({
	filter: z.string().transform((filter) => filter.toLowerCase()),
});
type FormData = z.infer<typeof schema>;

export default function CharsPageContent() {
	const [characters, setCharacters] = useState<CharacterData[] | null>(null);
	const { favorites, isLoading } = useUserFavorites();
	const currentUser = useCurrentUser();

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			filter: "",
		},
	});
	const filter = form.watch().filter.toLowerCase();

	useEffect(() => {
		authenticatedFetchAsync(getAlbinaApiFullAddress("/chars"), {
			cache: "no-cache",
		}).then((response) => {
			response
				.json()
				.then((data: { characters: CharacterData[] | null }) =>
					setCharacters(
						data.characters
							? data.characters.sort((a, b) => a.name.localeCompare(b.name))
							: []
					)
				);
		});
	}, [setCharacters]);
	if (characters === null) return null;
	if (characters.length === 0) {
		return (
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
		);
	}

	const filteredCharacters: CharacterData[] =
		filter.length === 0
			? characters
			: characters.filter(
					(character) =>
						character.name.toLowerCase().includes(filter) ||
						character.level === Number(filter)
			  );

	const allFavoriteCharacters: CharacterData[] = isLoading
		? []
		: favorites?.character.flatMap((favorite) => {
				const character = filteredCharacters.find(
					(character) => character.id == favorite.target.id
				);
				return character ? [character] : [];
		  }) ?? [];
	const allUserCharacters: CharacterData[] = currentUser.loading
		? []
		: filteredCharacters.filter(
				(character) => character.ownerId == currentUser.user?.id
		  );

	return (
		<UIBasics.Box
			withoutPadding
			backgroundColor="darkGray">
			<HookedForm.Form form={form}>
				<HookedForm.TextInput<FormData>
					fieldName="filter"
					label="Filtro"
				/>
				{filteredCharacters.length === 0 && (
					<UIBasics.Header
						textAlign="center"
						textColor="gray"
						children="Nenhum Resultado"
					/>
				)}
			</HookedForm.Form>

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
			{filteredCharacters.length !== 0 && (
				<>
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
						{filteredCharacters.map((character) => (
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
				</>
			)}
		</UIBasics.Box>
	);
}
