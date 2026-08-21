import { Campaign } from "../dataTypes/campaign";
import { CampaignMember } from "../dataTypes/campaignMember";
import { Guid } from "../misc";

export interface CampaignInvite {
	id: Guid;
	campaignId: Guid;
	memberId: Guid;
	maxUses: number;
	usedCount: number;
	createdAt: string;
	updatedAt?: string;
	campaign?: Campaign;
	member?: CampaignMember;
}
