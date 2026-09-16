"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export function useCurrentUser() {
	const { user, externalConnections, loading, reloadUser, clearUser } =
		useAuthStore();

	useEffect(() => {
		if (loading && user == null) void reloadUser();
	}, [loading, user, reloadUser]);

	return { user, externalConnections, loading, reloadUser, clearUser };
}
