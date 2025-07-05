"use client";

import { Star } from "@phosphor-icons/react/Star";
import { useCurrentPageData, useUserFavorites } from "@/libs/stp@hooks";
import { FavoriteButtonContainer } from "./styledElements";
import { NotionTextColor } from "@/components/(NotionBased)";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

export function FavoriteButton() {
	const { favorites, isLoading, reloadFavorites } = useUserFavorites();
	const { data, type, isSet } = useCurrentPageData();

	if (isLoading || isSet == false || type == null) {
		return (
			<FavoriteButtonContainer>
				<button
					title="Favorite Page"
					disabled>
					<Star
						color={NotionTextColor.darkGray}
						weight="fill"
					/>
				</button>
			</FavoriteButtonContainer>
		);
	}

	const isAlreadyFavorite = favorites?.[type].some(
		(favorite) => favorite.target.id == data?.id
	);

	async function handleAddFavorite() {
		try {
			const body = {
				type: type,
				targetId: data?.id,
			};
			const response = await authenticatedFetchAsync(`/users/me/favorites`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				cache: "no-store",
				body: JSON.stringify(body),
			});
			if (response.ok) await reloadFavorites();
		} catch (ex) {
			console.error(ex);
		}
	}
	async function handleRemoveFavorite() {
		try {
			const body = {
				type: type,
				targetId: data?.id,
			};
			const response = await authenticatedFetchAsync(`/users/me/favorites`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "DELETE",
				cache: "no-store",
				body: JSON.stringify(body),
			});
			if (response.ok) await reloadFavorites();
		} catch (ex) {
			console.error(ex);
		}
	}

	return (
		<FavoriteButtonContainer>
			{isAlreadyFavorite ? (
				<button
					title="Unfavorite Page"
					onClick={handleRemoveFavorite}>
					<Star
						color="#ffee00"
						weight="fill"
					/>
				</button>
			) : (
				<button
					title="Favorite Page"
					onClick={handleAddFavorite}>
					<Star
						color="#7b7b7b"
						weight="bold"
					/>
				</button>
			)}
		</FavoriteButtonContainer>
	);
}
