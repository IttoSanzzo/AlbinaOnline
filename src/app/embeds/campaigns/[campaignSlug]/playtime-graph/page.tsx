import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { Guid } from "@/libs/stp@types";

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
	searchParams: Promise<{ year?: number; userId?: Guid }>;
}
export default async function PlaytimeGraphPage({
	params,
	searchParams,
}: PlaytimeGraphPageProps) {
	const { campaignSlug } = await params;
	const { year: yearParam, userId } = await searchParams;

	let year = Number(yearParam);
	if (!year || Number.isNaN(year)) year = new Date().getFullYear();

	return (
		<PageView
			campaignSlug={campaignSlug}
			year={year}
			targetUserId={userId}
		/>
	);
}
