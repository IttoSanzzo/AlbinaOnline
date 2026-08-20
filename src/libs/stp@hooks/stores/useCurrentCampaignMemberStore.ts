"use client";

import { CampaignMember } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { create } from "zustand";

interface CampaignMemberState {
	member: CampaignMember | null;
	isMember: boolean | null;
	loading: boolean;
	setMember: (member: CampaignMember | null) => void;
	setIsMember: (isMember: boolean | null) => void;
	setLoading: (loading: boolean) => void;
	reloadMember: (campaignSlug: string) => Promise<void>;
	clear: () => void;
}

let reloadMemberPromise: Promise<void> | null = null;

export const useCurrentCampaignMemberStore = create<CampaignMemberState>(
	(set) => ({
		member: null,
		isMember: null,
		loading: true,
		setMember: (member: CampaignMember | null) => set({ member }),
		setIsMember: (isMember: boolean | null) => set({ isMember }),
		setLoading: (loading: boolean) => set({ loading }),
		reloadMember: async (campaignSlug: string) => {
			if (reloadMemberPromise != null) return reloadMemberPromise;

			reloadMemberPromise = (async () => {
				set({ loading: true, isMember: null });
				try {
					const response = await authenticatedFetchAsync(
						getAlbinaApiFullAddress(
							`/users/me/campaigns/${campaignSlug}/member`,
						),
						{
							cache: "no-store",
						},
					);
					if (response.status == 401) throw new Error("Not authenticated");
					if (response.status == 404) throw new Error("Not member");
					set({ member: await response.json(), isMember: true });
				} catch {
					set({ member: null, isMember: false });
				} finally {
					set({ loading: false });
				}
			})();
			try {
				await reloadMemberPromise;
			} finally {
				reloadMemberPromise = null;
			}
		},
		clear: () => {
			set({ member: null, isMember: null, loading: true });
		},
	}),
);
