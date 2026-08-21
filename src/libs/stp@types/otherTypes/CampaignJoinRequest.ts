import { Campaign } from "../dataTypes/campaign";
import { Guid } from "../misc";
import { FullUser } from "./FullUser";

export interface CampaignJoinRequest {
	id: Guid;
	campaignId: Guid;
	userId: Guid;
	createdAt: string;
	updatedAt?: string;
	campaign?: Campaign;
	user?: FullUser;
}
