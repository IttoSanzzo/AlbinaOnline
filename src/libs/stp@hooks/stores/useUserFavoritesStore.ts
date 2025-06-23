"use client";

import { userFavoritesGrouped } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { create } from "zustand";

interface FavoritesState {
	favorites: userFavoritesGrouped | null;
	isLoading: boolean;
	setFavorites: (favorites: userFavoritesGrouped | null) => void;
	setIsLoading: (loading: boolean) => void;
	reloadFavorites: () => Promise<void>;
}

export const useUserFavoritesStore = create<FavoritesState>((set) => ({
	favorites: null,
	isLoading: true,
	setFavorites: (favorites) => set({ favorites }),
	setIsLoading: (isLoading) => set({ isLoading }),
	reloadFavorites: async () => {
		set({ isLoading: true });
		try {
			const response = await authenticatedFetchAsync(
				`/users/me/favorites/grouped`,
				{
					cache: "no-store",
				}
			);
			if (!response.ok) throw new Error("Not authenticated");
			const data: { favorites: userFavoritesGrouped } = await response.json();
			set({ favorites: data.favorites });
		} catch {
			set({ favorites: null });
		} finally {
			set({ isLoading: false });
		}
	},
}));
