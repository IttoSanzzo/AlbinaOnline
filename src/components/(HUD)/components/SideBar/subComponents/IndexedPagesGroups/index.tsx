"use client";

import { useUserFavorites } from "@/libs/stp@hooks";
import IndexedPagesGroup from "./subComponents/IndexedPagesGroup";
import SortableIndexedPagesGroup, {
	SortableIndexedPage,
} from "./subComponents/SortableIndexedPagesGroup";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const IndexedPagesGroupsContainer = newStyledElement.div(
	styles.indexedPagesGroupsContainer,
);

type FavoriteWithSlug = {
	target: {
		id: string;
		name: string;
		slug: string;
		iconUrl: string;
	};
};

type FavoriteWithoutSlug = {
	target: {
		id: string;
		name: string;
		iconUrl: string;
	};
};

const CoreHubPageGroup = (
	<IndexedPagesGroup
		groupName="Core Hub"
		defaultOpenState={true}
		indexedPages={[
			{ name: "Chars", link: "/chars" },
			{ name: "Items", link: "/items" },
			{ name: "Maestrias", link: "/maestrias" },
			{ name: "Skills", link: "/skills" },
			{ name: "Spells", link: "/spells" },
			{ name: "Traços", link: "/tracos" },
			{ name: "Raças", link: "/racas" },
			{ name: "Codex", link: "/codex" },
			...(process.env.NODE_ENV === "development"
				? [{ name: "Sandbox", link: "/sandbox" }]
				: []),
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
		favoriteList: FavoriteWithSlug[],
	): SortableIndexedPage[] =>
		favoriteList.map((favorite: FavoriteWithSlug): SortableIndexedPage => {
			return {
				name: favorite.target.name,
				link: `${endpoint}/${favorite.target.slug}`,
				image: favorite.target.iconUrl,
			};
		});
	const getNonSluggedFavoriteSortableIndexedPage = (
		endpoint: string,
		favoriteList: FavoriteWithoutSlug[],
	): SortableIndexedPage[] =>
		favoriteList.map((favorite: FavoriteWithoutSlug): SortableIndexedPage => {
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
						favorites.character,
					)}
				/>
			)}
			{favorites?.item.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Items Fav."
					groupType="Item"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/items",
						favorites.item,
					)}
				/>
			)}
			{favorites.mastery.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Maestrias Fav."
					groupType="Mastery"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/maestrias",
						favorites.mastery,
					)}
				/>
			)}
			{favorites.skill.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Skills Fav."
					groupType="Skill"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/skills",
						favorites.skill,
					)}
				/>
			)}
			{favorites.spell.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Spells Fav."
					groupType="Spell"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/spells",
						favorites.spell,
					)}
				/>
			)}
			{favorites.trait.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Traits Fav."
					groupType="Trait"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/tracos",
						favorites.trait,
					)}
				/>
			)}
			{favorites.race.length > 0 && (
				<SortableIndexedPagesGroup
					groupName="Raças Fav."
					groupType="Race"
					indexedPages={getSluggedFavoriteSortableIndexedPage(
						"/racas",
						favorites.race,
					)}
				/>
			)}
		</IndexedPagesGroupsContainer>
	);
}
