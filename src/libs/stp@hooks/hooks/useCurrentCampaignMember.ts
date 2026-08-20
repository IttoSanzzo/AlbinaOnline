"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useCurrentCampaignMemberStore } from "../stores/useCurrentCampaignMemberStore";

export function useCurrentCampaignMember() {
	const pathname = usePathname();

	const {
		clear,
		isMember,
		loading,
		member,
		reloadMember,
		setIsMember,
		setLoading,
		setMember,
	} = useCurrentCampaignMemberStore();
	const campaignSlug = pathname.match(/^\/campanhas\/([^/]+)/)?.[1] ?? null;
	const loadedSlug = useRef<string | null>(null);

	useEffect(() => {
		if (campaignSlug == null) {
			clear();
			return;
		}
		if (loadedSlug.current === campaignSlug) return;
		loadedSlug.current = campaignSlug;
		void reloadMember(campaignSlug);
	}, [campaignSlug, reloadMember]);

	return {
		clear,
		isMember,
		loading,
		member,
		reloadMember,
		setIsMember,
		setLoading,
		setMember,
	};
}
