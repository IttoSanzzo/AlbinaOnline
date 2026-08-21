import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { getCacheMode } from "@/utils/Cache";
import { Campaign } from "@/libs/stp@types";
import { redirect } from "next/navigation";
import { SetBreadcrumbs } from "@/libs/stp@hooks";

export async function generateMetadata({
	params,
}: CampaignEditPageProps): Promise<Metadata> {
	const { campaignSlug } = await params;

	return assembleMetadata({
		title: "Ajustes",
		description: `Página de ajustas da campanha`,
		icon: getAlbinaApiFullAddress("/favicon/default/configuration"),
		ogImage: {
			url: getAlbinaApiFullAddress("/banner/default/configuration"),
		},
		route: `/campanhas/${campaignSlug}/ajustes`,
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

	return (
		<>
			<SetBreadcrumbs
				breadcrumbs={[
					{
						href: "/campanhas",
						name: "Campanhas",
						icon: getAlbinaApiFullAddress(`/favicon/campaigns`),
					},
					{
						href: `/campanhas/${data.slug}`,
						name: data.name,
						icon: getAlbinaApiFullAddress(`/favicon/campaigns/${data.slug}`),
					},
					{
						href: `/campanhas/${data.slug}/ajustes`,
						name: "Ajustes",
						icon: getAlbinaApiFullAddress(`/favicon/default/configuration`),
					},
				]}
			/>
			<PageView campaign={data} />
		</>
	);
}
