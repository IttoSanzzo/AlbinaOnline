"use client";

import {
	ExternalLoginProviders,
	ExternalLogins,
	FullUser,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { create } from "zustand";

interface AuthState {
	user: FullUser | null;
	externalLogins: ExternalLogins | null;
	loading: boolean;
	setUser: (user: FullUser | null) => void;
	setLoading: (loading: boolean) => void;
	reloadUser: () => Promise<void>;
	clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	externalLogins: null,
	loading: true,
	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	reloadUser: async () => {
		set({ loading: true });
		try {
			const response = await authenticatedFetchAsync(`/users/me`, {
				cache: "no-store",
			});
			if (!response.ok) throw new Error("Not authenticated");
			const data: { user: FullUser } = await response.json();
			set({ user: data.user });
			await loadExternalLogins(set);
		} catch {
			set({ user: null, externalLogins: null });
		} finally {
			set({ loading: false });
		}
	},
	clearUser: () => {
		set({ user: null, loading: true });
	},
}));

async function loadExternalLogins(set: {
	(
		partial:
			| AuthState
			| Partial<AuthState>
			| ((state: AuthState) => AuthState | Partial<AuthState>),
		replace?: false,
	): void;
	(state: AuthState | ((state: AuthState) => AuthState), replace: true): void;
}) {
	const results: ExternalLogins = {};

	for (const provider of ExternalLoginProviders) {
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/auth/me/external-logins/${provider}`),
			{ method: "GET" },
		);

		if (response.ok) {
			const { providerUserId } = await response.json();
			results[provider] = { externalUserId: providerUserId };
		}
	}

	set({
		externalLogins: results,
	});
}
