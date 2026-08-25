import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Guid } from "@/libs/stp@types";
import {
	CampaignPlaytimeGraph,
	PlaytimeColor,
} from "./page.components/CampaignPlaytimeGraph";

export async function generateMetadata({
	params,
}: PlaytimeGraphPageProps): Promise<Metadata> {
	const { campaignSlug } = await params;

	return assembleMetadata({
		title: "Playtime Graph",
		description: `${campaignSlug}'s Playtime Graph`,
		icon: getAlbinaApiFullAddress(`/favicon/campaigns/${campaignSlug}`),
		ogImage: {
			url: getAlbinaApiFullAddress(`/banner/campaigns/${campaignSlug}`),
		},
		route: `/embeds/campaigns/${campaignSlug}/playtime-graph`,
	});
}

interface PlaytimeGraphPageProps {
	params: Promise<{ campaignSlug: string }>;
	searchParams: Promise<{
		year?: number;
		userId?: Guid;
		headerColor?: PlaytimeColor;
		graphColor?: PlaytimeColor;
		tooltipColor?: PlaytimeColor;
	}>;
}
export default async function PlaytimeGraphPage({
	params,
	searchParams,
}: PlaytimeGraphPageProps) {
	const { campaignSlug } = await params;
	const {
		year: yearParam,
		userId,
		headerColor,
		graphColor,
		tooltipColor,
	} = await searchParams;

	let year = Number(yearParam);
	if (!year || Number.isNaN(year)) year = new Date().getFullYear();

	return (
		<CampaignPlaytimeGraph
			campaignSlug={campaignSlug}
			year={year}
			targetUserId={userId}
			graphColor={graphColor}
			headerColor={headerColor}
			tootipColor={tooltipColor}
		/>
	);
}
