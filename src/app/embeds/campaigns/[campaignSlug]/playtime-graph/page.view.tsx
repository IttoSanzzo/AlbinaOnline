import {
	CampaignPlaytimeGraph,
	CampaignPlaytimeGraphProps,
} from "./page.components/CampaignPlaytimeGraph";

export default function PlaytimeGraphPageView({
	...rest
}: CampaignPlaytimeGraphProps) {
	return <CampaignPlaytimeGraph {...rest} />;
}
