import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";
import { redirect } from "next/navigation";
import { Campaign } from "@/libs/stp@types";

export async function generateMetadata({
	params,
}: VttPageProps): Promise<Metadata> {
	const { campaignSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/campaigns/${campaignSlug}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: { tags: [`/campaigns`] },
		},
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "VTT not found",
		});
	}
	const data: MetadataData = await response.json();
	return assembleMetadata({
		title: `VTT | ${data.title}`,
		description: `VTT da campanha ${data.title}`,
		icon: getAlbinaApiFullAddress("/favicon/core-page/vtt"),
		ogImage: {
			url: getAlbinaApiFullAddress("/banner/core-page/vtt"),
		},
		route: `/campanhas/${campaignSlug}/vtt`,
		userDefaultTitlePrefix: false,
	});
}
interface VttPageProps {
	params: Promise<{ campaignSlug: string }>;
}
export default async function VttPage({ params }: VttPageProps) {
	const { campaignSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/campaigns/${campaignSlug}`),
	);
	if (!response.ok) return redirect("/campanhas");
	const data: Campaign = await response.json();
	return <PageView campaign={data} />;
}
