"use client";

import { useAuthStore, useUserFavoritesStore } from "../stores";

export function resetAllStores() {
	useUserFavoritesStore.getState().clearFavorites();
	useAuthStore.getState().clearUser();
}
