"use client";

import { SetNavBarModules } from "@/libs/stp@hooks";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { MasterPageContextMenu } from "./MasterPageContent.components/PageContextMenu";
import { NotMasterPageContextMenu } from "./MemberPageContent.components/PageContextMenu";
import { CampaingJoinRequests } from "./MasterPageContent.components/CampaingJoinRequests";
import { GenericInfoMultiColumn } from "@/components/(Design)/components/GenericInfoMultiColumn";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

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
			{member.isMaster ? (
				<>
					<SetNavBarModules
						contextMenuButton={() => (
							<MasterPageContextMenu campaignSlug={campaign.slug} />
						)}
					/>
					<CampaingJoinRequests campaignSlug={campaign.slug} />
					Master
				</>
			) : (
				<>
					<SetNavBarModules contextMenuButton={NotMasterPageContextMenu} />
					Member
				</>
			)}

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/gallery/campaigns/${campaign.slug}`)}
				hideIfEmpty
			/>
			<GenericInfoMultiColumn
				info={campaign.info}
				hideIfEmpty
			/>
		</>
	);
}
