import { Guid } from "../misc";
import { FullUser } from "../otherTypes";
import { Campaign } from "./campaign";

export type CampaignMember = {
	id: Guid;
	userId: Guid;
	campaignId: Guid;
	isMaster: boolean;
	createdAt: string;
	updatedAt?: string;
	user: FullUser;
	campaign: Campaign;
};
