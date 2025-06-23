"use client";

import { useEffect } from "react";
import { useUserFavoritesStore } from "../stores/useUserFavoritesStore";

export function useUserFavorites() {
	const { favorites, isLoading, reloadFavorites } = useUserFavoritesStore();

	useEffect(() => {
		if (favorites == null && isLoading) reloadFavorites();
	}, []);

	return { favorites, isLoading, reloadFavorites };
}
