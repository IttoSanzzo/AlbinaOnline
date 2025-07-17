"use client";

import { useUserFavorites } from "@/libs/stp@hooks";
import { IndexedPagesGroupsContainer } from "./styledElements";
import IndexedPagesGroup from "./subComponents/IndexedPagesGroup";
import SortableIndexedPagesGroup, {
	SortableIndexedPage,
} from "./subComponents/SortableIndexedPagesGroup";

const CoreHubPageGroup = (
	<IndexedPagesGroup
		groupName="Core Hub"
		indexedPages={[
			{ name: "Chars", link: "/chars" },
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

	if (favorites === null) {
		return (
			<IndexedPagesGroupsContainer>
				{CoreHubPageGroup}
			</IndexedPagesGroupsContainer>
		);
	}

	const getSluggedFavoriteSortableIndexedPage = (
		endpoint: string,
		favoriteList: any
	): SortableIndexedPage[] =>
		favoriteList.map((favorite: any): SortableIndexedPage => {
			return {
				name: favorite.target.name,
				link: `${endpoint}/${favorite.target.slug}`,
				image: favorite.target.iconUrl,
			};
		});
	const getNonSluggedFavoriteSortableIndexedPage = (
		endpoint: string,
		favoriteList: any
	): SortableIndexedPage[] =>
		favoriteList.map((favorite: any): SortableIndexedPage => {
			return {
				name: favorite.target.name,
				link: `${endpoint}/${favorite.target.id}`,
				image: favorite.target.iconUrl,
			};
		});

	return (
		<IndexedPagesGroupsContainer>
			{CoreHubPageGroup}

			{favorites?.character.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Chars Fav."
					groupType="Character"
					indexedPages={getNonSluggedFavoriteSortableIndexedPage(
						"/chars",
						favorites.character
					)}
				/>
			)}
			{favorites?.item.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Items Fav."
					groupType="Item"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/items",
						favorites.item
					)}
				/>
			)}
			{favorites.mastery.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Maestrias Fav."
					groupType="Mastery"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/maestrias",
						favorites.mastery
					)}
				/>
			)}
			{favorites.skill.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Skills Fav."
					groupType="Skill"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/skills",
						favorites.skill
					)}
				/>
			)}
			{favorites.spell.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Spells Fav."
					groupType="Spell"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/spells",
						favorites.spell
					)}
				/>
			)}
			{favorites.trait.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Traits Fav."
					groupType="Trait"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/tracos",
						favorites.trait
					)}
				/>
			)}
			{favorites.race.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Raças Fav."
					groupType="Race"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/racas",
						favorites.race
					)}
				/>
			)}
		</IndexedPagesGroupsContainer>
	);
}
