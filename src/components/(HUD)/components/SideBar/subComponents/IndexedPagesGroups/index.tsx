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

	return (
		<IndexedPagesGroupsContainer>
			{CoreHubPageGroup}

			{favorites?.Item.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Items Fav."
					groupType="Item"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/items",
						favorites.Item
					)}
				/>
			)}
			{favorites.Mastery.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Maestrias Fav."
					groupType="Mastery"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/maestrias",
						favorites.Mastery
					)}
				/>
			)}
			{favorites.Skill.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Skills Fav."
					groupType="Skill"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/skills",
						favorites.Skill
					)}
				/>
			)}
			{favorites.Spell.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Spells Fav."
					groupType="Spell"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/spells",
						favorites.Spell
					)}
				/>
			)}
			{favorites.Trait.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Traits Fav."
					groupType="Trait"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/tracos",
						favorites.Trait
					)}
				/>
			)}
			{favorites.Race.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Raças Fav."
					groupType="Race"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/racas",
						favorites.Race
					)}
				/>
			)}
		</IndexedPagesGroupsContainer>
	);
}
