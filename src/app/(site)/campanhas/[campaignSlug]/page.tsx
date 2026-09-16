import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";
import { redirect } from "next/navigation";
import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { Campaign, CampaignTypeName } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { StandartTextColor } from "@/components/(UIBasics)";

export async function generateMetadata({
	params,
}: CampaignPageProps): Promise<Metadata> {
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

interface CampaignPageProps {
	params: Promise<{ campaignSlug: string }>;
}
export default async function CampaignPage({ params }: CampaignPageProps) {
	const { campaignSlug } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/campaigns/${campaignSlug}`),
	);
	if (!response.ok) return redirect("/campanhas");
	const data: Campaign = await response.json();

	return (
		<GenericPageContainer
			title={data.name}
			icon={data.iconUrl}
			banner={data.bannerUrl}
			borderColor={
				data.isListed ? StandartTextColor["blue"] : StandartTextColor["purple"]
			}
			subTitle={
				<div
					style={{
						display: "flex",
						color: StandartTextColor["darkGray"],
					}}>
					<StyledFalseLink
						color={StandartTextColor["purple"]}
						title={`${data.masterCount} Mestre${data.masterCount > 1 ? "s" : ""}`}
						withoutIcon
					/>
					{" _ "}
					<StyledFalseLink
						color={
							data.maxPlayers == 0 || data.playerCount < data.maxPlayers
								? StandartTextColor["green"]
								: StandartTextColor["red"]
						}
						title={`${data.playerCount}${data.maxPlayers > 0 ? ` / ${data.maxPlayers}` : ""} Jogador${data.playerCount <= 1 && data.maxPlayers <= 1 ? "" : "es"}`}
						withoutIcon
					/>
					{" _ "}
					<StyledFalseLink
						color={StandartTextColor["blue"]}
						title={CampaignTypeName[data.type]}
						withoutIcon
					/>
				</div>
			}
			subTitle2={
				<StyledLink
					title={"Acessar o VTT"}
					style={{ height: "fit-content" }}
					icon={getAlbinaApiFullAddress("/favicon/core-page/vtt")}
					href={`/campanhas/${data.slug}/vtt`}
				/>
			}>
			<PageView campaign={data} />
		</GenericPageContainer>
	);
}
