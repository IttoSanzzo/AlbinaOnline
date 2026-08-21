"use client";

import { SetNavBarModules } from "@/libs/stp@hooks";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { PageContextMenu } from "./MasterPageContent.components/PageContextMenu";
import { CampaingJoinRequests } from "./MasterPageContent.components/CampaingJoinRequests";

interface MasterPageContentProps {
	campaign: Campaign;
	member: CampaignMember;
}
export function MasterPageContent({
	campaign,
	member,
}: MasterPageContentProps) {
	void campaign;
	void member;

	return (
		<>
			<SetNavBarModules contextMenuButton={PageContextMenu} />
			<CampaingJoinRequests campaignSlug={campaign.slug} />
			Master KIWI
		</>
	);
}
