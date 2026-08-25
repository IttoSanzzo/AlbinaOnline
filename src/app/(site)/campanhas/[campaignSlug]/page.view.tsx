"use client";

import { memo } from "react";

import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { useCurrentCampaignMember } from "@/libs/stp@hooks";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { NotAMemberPageContent } from "./page.components/NotAMemberPageContent";
import { MemberPageContent } from "./page.components/MemberPageContent";

interface CampaignPageViewProps {
	campaign: Campaign;
}

export default function CampaignPageView({ campaign }: CampaignPageViewProps) {
	const { loading, isMember, member } = useCurrentCampaignMember();

	return (
		<CampaignPageContent
			campaign={campaign}
			loading={loading}
			isMember={isMember}
			member={member}
		/>
	);
}

const CampaignPageContent = memo(function CampaignPageContent({
	campaign,
	loading,
	isMember,
	member,
}: {
	campaign: Campaign;
	loading: boolean;
	isMember: boolean | null;
	member: CampaignMember | null;
}) {
	void campaign;

	if (loading === true || isMember === null)
		return <LoadingCircle centralizeVertical={18} />;

	if (isMember === false) return <NotAMemberPageContent campaign={campaign} />;
	if (member === null) return <LoadingCircle centralizeVertical={18} />;
	return (
		<MemberPageContent
			campaign={campaign}
			member={member}
		/>
	);
});
