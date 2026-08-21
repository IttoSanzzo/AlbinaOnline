import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";
import { getCacheMode } from "@/utils/Cache";
import { Campaign } from "@/libs/stp@types";
import { redirect } from "next/navigation";

export async function generateMetadata({
	params,
}: CampaignEditPageProps): Promise<Metadata> {
	const { campaignSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/campaign/${campaignSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: { tags: [`/campaigns`] },
		},
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Campaign Not Found",
		});
	}
	const data: MetadataData = await response.json();
	return assembleMetadata({
		title: data.title,
		description: data.description,
		icon: data.icon,
		ogImage: {
			url: data.ogImage,
		},
		route: `/campanhas/${campaignSlug}`,
	});
}

interface CampaignEditPageProps {
	params: Promise<{ campaignSlug: string }>;
}
export default async function CampaignEditPage({
	params,
}: CampaignEditPageProps) {
	const { campaignSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/campaigns/${campaignSlug}`),
		{
			cache: getCacheMode(),
			next: { tags: [`/campaigns`] },
		},
	);
	if (!response.ok) return redirect(`/campanhas/${campaignSlug}`);
	const data: Campaign = await response.json();

	return <PageView campaign={data} />;
}
