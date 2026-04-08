"use client";

import { Guid } from "@/libs/stp@types";
import { AccessLevel } from "@/libs/stp@types/otherTypes/AccessLevel";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { create } from "zustand";

interface CurrentNpcAccessLevelState {
	accessLevel: AccessLevel;
	isSet: boolean;
	setAccessLevel: (accessLevel: AccessLevel) => void;
	setIsSet: (loading: boolean) => void;
	fetchAccessLevel: (npcId: Guid) => Promise<void>;
	clearAccessLevel: () => void;
}

export const useCurrentNpcAccessLevelStore = create<CurrentNpcAccessLevelState>(
	(set) => ({
		accessLevel: AccessLevel.None,
		isSet: false,
		setAccessLevel: (accessLevel) => set({ accessLevel }),
		setIsSet: (isSet) => set({ isSet }),
		fetchAccessLevel: async (npcId: Guid) => {
			set({ isSet: false });
			try {
				const response = await authenticatedFetchAsync(
					`/npcs/${npcId}/my-access-level`,
					{
						cache: "no-store",
					},
				);
				if (!response.ok) throw new Error("Not authenticated");
				const data: { accessLevel: keyof typeof AccessLevel } =
					await response.json();
				set({
					accessLevel: AccessLevel[data.accessLevel],
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
	}),
);
