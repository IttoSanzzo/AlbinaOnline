"use client";

import {
	useAuthStore,
	useCurrentCharacterAccessLevelStore,
	useUserFavoritesStore,
} from "../stores";

export function resetAllStores() {
	useUserFavoritesStore.getState().clearFavorites();
	useAuthStore.getState().clearUser();
	useCurrentCharacterAccessLevelStore.getState().clearAccessLevel();
}
