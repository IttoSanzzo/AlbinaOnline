import { Guid } from "../misc";
import { Campaign } from "./campaign";

export interface CampaignSessionDay {
	id: Guid;
	campaignId: Guid;
	date: string;
	playtime: PlaytimeCounter;
	playersPlaytimes: PlayerPlaytimeCounter[];
	campaign: Campaign;
}

export interface PlaytimeCounter {
	totalPlaytimeSeconds: number;
	stopwatchStartedAt?: string | null;
}

export interface PlayerPlaytimeCounter extends PlaytimeCounter {
	id: Guid;
	userId: Guid;
}

export interface DatedPlaytime {
	date: string;
	totalPlaytimeSeconds: number;
}
