"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { CampaignInvitesManager } from "./CampaignInvitesManager";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useRouter } from "next/navigation";
import { toSlug } from "@/libs/stp@forms";
import { DeleteCampaignAlertDialog } from "./DeleteCampaignAlertDialog";
import { UIBasics } from "@/components/(UIBasics)";
import { CampaignInfoEditor } from "./CampaignInfoEditor";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { CampaignMembersManager } from "./CampaignMembersManager";
import { CampaignSettingsManager } from "./CampaignSettingsManager";
import { CampaingJoinRequests } from "../../page.components/MasterPageContent.components/CampaingJoinRequests";

interface EditPageContentProps {
	campaign: Campaign;
	member: CampaignMember;
}
export function EditPageContent({ campaign, member }: EditPageContentProps) {
	const router = useRouter();

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
			<CampaingJoinRequests campaignSlug={campaign.slug} />

			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.MultiColumn.Three
					colum1={<CampaignSettingsManager campaign={campaign} />}
					colum2={
						<CampaignMembersManager
							campaign={campaign}
							currentMember={member}
						/>
					}
					colum3={<CampaignInvitesManager campaignSlug={campaign.slug} />}
				/>
			</UIBasics.Box>

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/gallery/campaigns/${campaign.slug}`)}
				isEditable
			/>
			<CampaignInfoEditor campaign={campaign} />

			<UIBasics.Divisor />
			<UIBasics.Box backgroundColor="darkGray">
				<DeleteCampaignAlertDialog campaign={campaign} />
			</UIBasics.Box>
			<UIBasics.Divisor />
		</GenericPageContainer>
	);
}
