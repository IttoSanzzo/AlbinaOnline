"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { CampaignInvitesManager } from "./CampaignInvitesManager";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useRouter } from "next/navigation";
import { toSlug } from "@/libs/stp@forms";
import { DeleteCampaignAlertDialog } from "./DeleteCampaignAlertDialog";
import { UIBasics } from "@/components/(UIBasics)";

interface EditPageContentProps {
	campaign: Campaign;
	member: CampaignMember;
}
export function EditPageContent({ campaign, member }: EditPageContentProps) {
	const router = useRouter();
	void member;

	return (
		<GenericPageContainer
			title={campaign.name}
			icon={campaign.iconUrl}
			banner={campaign.bannerUrl}
			isEditable
			iconChangeRoute={getAlbinaApiFullAddress(
				`/campaigns/${campaign.slug}/favicon`,
			)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/campaigns/${campaign.slug}/banner`,
			)}
			titleChangeRoute={getAlbinaApiFullAddress(
				`/campaigns/${campaign.slug}/name`,
			)}
			titleChangeBodyPropName="name"
			onTitleChange={async (title) => {
				router.push(`/campanhas/${toSlug(title)}/ajustes`);
			}}
			cacheTags={["/campaigns"]}
			cachePaths={["/campanhas", `/campanhas/${campaign.slug}`]}>
			<CampaignInvitesManager campaignSlug={campaign.slug} />

			<UIBasics.Divisor />
			<UIBasics.Box backgroundColor="darkGray">
				<DeleteCampaignAlertDialog campaign={campaign} />
			</UIBasics.Box>
			<UIBasics.Divisor />
		</GenericPageContainer>
	);
}
