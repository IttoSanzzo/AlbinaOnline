"use client";

import { SetNavBarModules } from "@/libs/stp@hooks";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { PageContextMenu } from "./MasterPageContent.components/PageContextMenu";

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
			Master KIWI
		</>
	);
}
