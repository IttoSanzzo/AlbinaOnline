"use client";

import { create } from "zustand";

export type PageNavigationHistoryEntry = {
	name: string;
	url: string;
	icon: string;
};

interface NavigationHistoryState {
	history: PageNavigationHistoryEntry[];
	setHistory: (history: PageNavigationHistoryEntry[]) => void;
	addHistoryEntry: (entry: PageNavigationHistoryEntry) => void;
	isSet: boolean;
	setIsSet: (isSet: boolean) => void;
	loadHistory: () => void;
	clearHistory: () => void;
}

export const useNavigationHistoryStore = create<NavigationHistoryState>(
	(set) => ({
		history: [],
		isSet: false,
		setHistory: (history) => {
			try {
				localStorage.setItem("PageNavigationHistory", JSON.stringify(history));
				set({ history });
			} catch {}
		},
		addHistoryEntry: (entry) => {
			try {
				set((state) => {
					const newHistory = [
						entry,
						...state.history
							.filter((oldEntry) => oldEntry.url != entry.url)
							.slice(0, 19),
					];
					localStorage.setItem(
						"PageNavigationHistory",
						JSON.stringify(newHistory),
					);
					return {
						history: newHistory,
					};
				});
			} catch {}
		},
		setIsSet: (isSet) => set({ isSet }),
		loadHistory: () => {
			try {
				const raw = localStorage.getItem("PageNavigationHistory");
				const history = raw ? JSON.parse(raw) : [];
				set({ history, isSet: true });
			} catch {
				set({ history: [], isSet: true });
			}
		},
		clearHistory: () => {
			try {
				localStorage.setItem("PageNavigationHistory", JSON.stringify([]));
				set({ history: [], isSet: true });
			} catch {}
		},
	}),
);
