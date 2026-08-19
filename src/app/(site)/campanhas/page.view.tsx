"use client";

import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { UIBasics } from "@/components/(UIBasics)";
import { useCurrentUser } from "@/libs/stp@hooks";
import { Campaign } from "@/libs/stp@types";
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
			setlAlListedCampaigns(await response.json());
		})();
		(async () => {
			const response = await authenticatedFetchAsync(
				getAlbinaApiFullAddress(`/users/me/campaigns`),
			);
			if (!response.ok) return;
			setUserCampaigns(await response.json());
		})();
	}, [user]);

	if (user == null || userCampaigns == null || allListedCampaigns == null)
		return <LoadingCircle centralizeVertical={23} />;

	return (
		<>
			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.Header
					textAlign="center"
					textColor="yellow">
					Suas Campanhas
				</UIBasics.Header>
				<div>
					{userCampaigns.map((campaign) => (
						<UIBasics.Box key={campaign.id}>{campaign.name}</UIBasics.Box>
					))}
				</div>
				<div>a,b,c</div>
			</UIBasics.Box>
			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.Header
					textAlign="center"
					textColor="darkGray">
					Outras Campanhas
				</UIBasics.Header>
				<div>
					{userCampaigns.map((campaign) => (
						<div key={campaign.id}>{campaign.name}</div>
					))}
				</div>
				<div>a,b,c</div>
			</UIBasics.Box>
		</>
	);
}
