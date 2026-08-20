"use client";

import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { CampaignCard } from "@/components/(SPECIAL)/components/CampaignCard";
import { UIBasics } from "@/components/(UIBasics)";
import { useCurrentUser } from "@/libs/stp@hooks";
import { Campaign, Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useEffect, useState } from "react";

export default function CampaignsPageView() {
	const [userCampaigns, setUserCampaigns] = useState<Campaign[] | null>(null);
	const [allListedCampaigns, setlAlListedCampaigns] = useState<
		Campaign[] | null
	>(null);

	const { user } = useCurrentUser();

	useEffect(() => {
		if (!user) return;

		(async () => {
			const response = await fetch(getAlbinaApiFullAddress(`/campaigns`));
			if (!response.ok) return;
			setlAlListedCampaigns(
				((await response.json()) as Campaign[]).sort(
					(a, b) =>
						new Date(b.updatedAt ?? b.createdAt).getTime() -
						new Date(a.updatedAt ?? a.createdAt).getTime(),
				),
			);
		})();
		(async () => {
			const response = await authenticatedFetchAsync(
				getAlbinaApiFullAddress(`/users/me/campaigns`),
			);
			if (!response.ok) return;
			setUserCampaigns(
				((await response.json()) as Campaign[]).sort(
					(a, b) =>
						new Date(b.updatedAt ?? b.createdAt).getTime() -
						new Date(a.updatedAt ?? a.createdAt).getTime(),
				),
			);
		})();
	}, [user]);

	if (user == null || userCampaigns == null || allListedCampaigns == null)
		return <LoadingCircle centralizeVertical={23} />;

	const participatingCampaignsIds = new Set<Guid>(
		userCampaigns.map((x) => x.id),
	);

	const notParticipatingCampaigns = allListedCampaigns.filter(
		(campaign) => !participatingCampaignsIds.has(campaign.id),
	);

	return (
		<>
			{userCampaigns.length == 0 && notParticipatingCampaigns.length == 0 && (
				<UIBasics.Box>
					<UIBasics.Header headerType="h1">
						Nenhuma Campanha Encontrada
					</UIBasics.Header>
				</UIBasics.Box>
			)}
			{userCampaigns.length > 0 && (
				<UIBasics.Box backgroundColor="purple">
					<UIBasics.Header
						textAlign="center"
						textColor="purple">
						Suas Campanhas
					</UIBasics.Header>
					<UIBasics.List.Grid
						columnWidth={350}
						direction="row"
						backgroundColor="darkGray">
						{userCampaigns.map((campaign) => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								isMember={true}
							/>
						))}
					</UIBasics.List.Grid>
				</UIBasics.Box>
			)}
			{notParticipatingCampaigns.length > 0 && (
				<UIBasics.Box backgroundColor="gray">
					<UIBasics.Header
						textAlign="center"
						textColor="gray">
						Outras Campanhas
					</UIBasics.Header>
					<UIBasics.List.Grid
						columnWidth={350}
						direction="row"
						backgroundColor="darkGray">
						{notParticipatingCampaigns.map((campaign) => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								isMember={true}
							/>
						))}
					</UIBasics.List.Grid>
				</UIBasics.Box>
			)}
		</>
	);
}
