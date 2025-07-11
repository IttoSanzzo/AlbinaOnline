"use client";

import { AccessLevel } from "@/libs/stp@types/otherTypes/AccessLevel";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { create } from "zustand";

interface CurrentCharacterAccessLevelState {
	accessLevel: AccessLevel;
	isSet: boolean;
	setAccessLevel: (accessLevel: AccessLevel) => void;
	setIsSet: (loading: boolean) => void;
	fetchAccessLevel: (characterId: string) => Promise<void>;
	clearAccessLevel: () => void;
}

export const useCurrentCharacterAccessLevelStore =
	create<CurrentCharacterAccessLevelState>((set) => ({
		accessLevel: AccessLevel.None,
		isSet: false,
		setAccessLevel: (accessLevel) => set({ accessLevel }),
		setIsSet: (isSet) => set({ isSet }),
		fetchAccessLevel: async (characterId: string) => {
			set({ isSet: false });
			try {
				const response = await authenticatedFetchAsync(
					`/chars/${characterId}/my-access-level`,
					{
						cache: "no-store",
					}
				);
				if (!response.ok) throw new Error("Not authenticated");
				const data: { accessLevel: string } = await response.json();
				set({
					accessLevel:
						AccessLevel[data.accessLevel as keyof typeof AccessLevel],
				});
			} catch {
				set({ accessLevel: AccessLevel.None });
			} finally {
				set({ isSet: true });
			}
		},
		clearAccessLevel: () => {
			set({ accessLevel: AccessLevel.None, isSet: false });
		},
	}));
