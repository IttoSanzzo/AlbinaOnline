import { GenericPageContainer } from "@/components/(Design)";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { CampaignInvitesManager } from "./CampaignInvitesManager";

interface EditPageContentProps {
	campaign: Campaign;
	member: CampaignMember;
}
export function EditPageContent({ campaign, member }: EditPageContentProps) {
	void member;

	return (
		<GenericPageContainer
			title={campaign.name}
			icon={campaign.iconUrl}
			banner={campaign.bannerUrl}
			isEditable
			iconChangeRoute={``}
			bannerChangeRoute={``}
			titleChangeRoute={``}
			cacheTags={["/campaigns"]}
			cachePaths={["/campanhas", `/campanhas/${campaign.slug}`]}>
			<CampaignInvitesManager campaignSlug={campaign.slug} />
		</GenericPageContainer>
	);
}
