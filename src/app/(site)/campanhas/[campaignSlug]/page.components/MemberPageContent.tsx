"use client";

import { SetNavBarModules } from "@/libs/stp@hooks";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { MasterPageContextMenu } from "./MasterPageContent.components/PageContextMenu";
import { NotMasterPageContextMenu } from "./MemberPageContent.components/PageContextMenu";
import { CampaingJoinRequests } from "./MasterPageContent.components/CampaingJoinRequests";
import { GenericInfoMultiColumn } from "@/components/(Design)/components/GenericInfoMultiColumn";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";
import { CampaignPlaytimeGraph } from "@/app/embeds/campaigns/[campaignSlug]/playtime-graph/page.components/CampaignPlaytimeGraph";

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
					{/* Master */}
				</>
			) : (
				<>
					<SetNavBarModules contextMenuButton={NotMasterPageContextMenu} />
					{/* Member */}
				</>
			)}

			<UIBasics.Divisor />

			<UIBasics.Box
				backgroundColor="darkerGray"
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<UIBasics.Header textColor="darkTeal">
					Tempo de Campanha
				</UIBasics.Header>
				<CampaignPlaytimeGraph
					campaignSlug={campaign.slug}
					headerColor="yellow"
					graphColor="yellow"
					tootipColor="yellow"
				/>
				<UIBasics.Header textColor="darkTeal">Tempo do Jogador</UIBasics.Header>
				<CampaignPlaytimeGraph
					campaignSlug={campaign.slug}
					targetUserId={member.userId}
					headerColor="blue"
					graphColor="purple"
					tootipColor="purple"
				/>
				<UIBasics.Box style={{ opacity: 0 }} />
			</UIBasics.Box>

			<UIBasics.Divisor />

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
