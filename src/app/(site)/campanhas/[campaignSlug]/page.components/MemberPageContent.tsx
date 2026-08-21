"use client";

import { SetNavBarModules } from "@/libs/stp@hooks";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { PageContextMenu } from "./MemberPageContent.components/PageContextMenu";

interface MemberPageContentProps {
	campaign: Campaign;
	member: CampaignMember;
}
export function MemberPageContent({
	campaign,
	member,
}: MemberPageContentProps) {
	void campaign;
	void member;

	return (
		<>
			<SetNavBarModules contextMenuButton={PageContextMenu} />
			Member EHE
		</>
	);
}
