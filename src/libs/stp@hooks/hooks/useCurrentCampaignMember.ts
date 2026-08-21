"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useCurrentCampaignMemberStore } from "../stores/useCurrentCampaignMemberStore";

export function useCurrentCampaignMember() {
	const pathname = usePathname();

	const {
		isMember,
		loadedCampaignSlug,
		member,
		loading,
		reloadMember,
		setMember,
		setIsMember,
		setLoading,
		clear,
	} = useCurrentCampaignMemberStore();
	const campaignSlug = pathname.match(/^\/campanhas\/([^/]+)/)?.[1] ?? null;

	useEffect(() => {
		if (campaignSlug == null) {
			clear();
			return;
		}
		if (loadedCampaignSlug === campaignSlug) return;
		reloadMember(campaignSlug);
	}, [campaignSlug, reloadMember, loadedCampaignSlug]);

	return {
		isMember,
		loadedCampaignSlug,
		member,
		loading,
		reloadMember,
		setMember,
		setIsMember,
		setLoading,
		clear,
	};
}
