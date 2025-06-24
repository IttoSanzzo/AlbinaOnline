"use client";

import { useUserFavorites } from "@/libs/stp@hooks";
import { IndexedPagesGroupsContainer } from "./styledElements";
import IndexedPagesGroup, {
	IndexedPage,
} from "./subComponents/IndexedPagesGroup";

const CoreHubPageGroup = (
	<IndexedPagesGroup
		groupName="Core Hub"
		indexedPages={[
			{ name: "Items", link: "/items" },
			{ name: "Maestrias", link: "/maestrias" },
			{ name: "Skills", link: "/skills" },
			{ name: "Spells", link: "/spells" },
			{ name: "Traços", link: "/tracos" },
			{ name: "Raças", link: "/racas" },
		]}
	/>
);

export default function IndexedPagesGroups() {
	const { favorites } = useUserFavorites();

	if (favorites === null)
		return (
			<IndexedPagesGroupsContainer>
				{CoreHubPageGroup}
			</IndexedPagesGroupsContainer>
		);

	const getSluggedFavoriteIndexedPage = (endpoint: string, favoriteList: any) =>
		favoriteList.map((favorite: any): IndexedPage => {
			return {
				name: favorite.target.name,
				link: `${endpoint}/${favorite.target.slug}`,
				image: favorite.target.iconUrl,
			};
		});

	return (
		<IndexedPagesGroupsContainer>
			{CoreHubPageGroup}

			{favorites?.Item.length > 0 && (
				<IndexedPagesGroup
					groupName="Items Fav."
					indexedPages={getSluggedFavoriteIndexedPage("/items", favorites.Item)}
				/>
			)}
			{favorites.Mastery.length > 0 && (
				<IndexedPagesGroup
					groupName="Maestrias Fav."
					indexedPages={getSluggedFavoriteIndexedPage(
						"/maestrias",
						favorites.Mastery
					)}
				/>
			)}
			{favorites.Skill.length > 0 && (
				<IndexedPagesGroup
					groupName="Skills Fav."
					indexedPages={getSluggedFavoriteIndexedPage(
						"/skills",
						favorites.Skill
					)}
				/>
			)}
			{favorites.Spell.length > 0 && (
				<IndexedPagesGroup
					groupName="Spells Fav."
					indexedPages={getSluggedFavoriteIndexedPage(
						"/spells",
						favorites.Spell
					)}
				/>
			)}
			{favorites.Trait.length > 0 && (
				<IndexedPagesGroup
					groupName="Traits Fav."
					indexedPages={getSluggedFavoriteIndexedPage(
						"/tracos",
						favorites.Trait
					)}
				/>
			)}
			{favorites.Race.length > 0 && (
				<IndexedPagesGroup
					groupName="Raças Fav."
					indexedPages={getSluggedFavoriteIndexedPage("/racas", favorites.Race)}
				/>
			)}
		</IndexedPagesGroupsContainer>
	);
}
