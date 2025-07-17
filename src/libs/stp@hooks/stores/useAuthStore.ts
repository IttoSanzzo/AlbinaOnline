"use client";

import { FullUser } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { create } from "zustand";

interface AuthState {
	user: FullUser | null;
	loading: boolean;
	setUser: (user: FullUser | null) => void;
	setLoading: (loading: boolean) => void;
	reloadUser: () => Promise<void>;
	clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
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
		} catch {
			set({ user: null });
		} finally {
			set({ loading: false });
		}
	},
	clearUser: () => {
		set({ user: null, loading: true });
	},
}));
