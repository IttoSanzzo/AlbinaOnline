"use client";

import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { useCurrentCampaignMember } from "@/libs/stp@hooks";
import { Campaign } from "@/libs/stp@types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EditPageContent } from "./page.components/EditPageContent";

interface AjustesPageViewProps {
	campaign: Campaign;
}
export default function AjustesPageView({ campaign }: AjustesPageViewProps) {
	const { loading, isMember, member } = useCurrentCampaignMember();
	const router = useRouter();

	useEffect(() => {
		if (isMember == null) return;
		if (isMember == false || member == null || !member.isMaster)
			router.replace(`/campanhas/${campaign.slug}`);
	}, [isMember, member, router]);

	if (
		loading ||
		isMember == null ||
		isMember == false ||
		member == null ||
		!member.isMaster
	)
		return <LoadingCircle centralizeVertical={23} />;
	return (
		<EditPageContent
			campaign={campaign}
			member={member}
		/>
	);
}
