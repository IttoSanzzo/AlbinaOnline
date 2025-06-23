"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export function useCurrentUser() {
	const { user, loading, reloadUser } = useAuthStore();

	useEffect(() => {
		if (user == null && loading) reloadUser();
	}, []);

	return { user, loading, reloadUser };
}
