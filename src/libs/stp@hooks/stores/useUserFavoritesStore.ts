"use client";

import { LintIgnoredAny, UserFavoritesGrouped } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { create } from "zustand";

interface FavoritesState {
	favorites: UserFavoritesGrouped | null;
	isLoading: boolean;
	setFavorites: (favorites: UserFavoritesGrouped | null) => void;
	setIsLoading: (loading: boolean) => void;
	reloadFavorites: () => Promise<void>;
	clearFavorites: () => void;
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
			const data: { favorites: LintIgnoredAny } = await response.json();
			set({
				favorites: {
					character: data.favorites.Character,
					item: data.favorites.Item,
					mastery: data.favorites.Mastery,
					race: data.favorites.Race,
					skill: data.favorites.Skill,
					spell: data.favorites.Spell,
					trait: data.favorites.Trait,
				},
			});
		} catch {
			set({ favorites: null });
		} finally {
			set({ isLoading: false });
		}
	},
	clearFavorites: () => {
		set({ favorites: null, isLoading: true });
	},
}));
