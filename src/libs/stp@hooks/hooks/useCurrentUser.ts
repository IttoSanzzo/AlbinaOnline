"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export function useCurrentUser() {
	const { user, externalLogins, loading, reloadUser, clearUser } =
		useAuthStore();

	useEffect(() => {
		if (user == null && loading) reloadUser();
	}, []);

	return { user, externalLogins, loading, reloadUser, clearUser };
}
