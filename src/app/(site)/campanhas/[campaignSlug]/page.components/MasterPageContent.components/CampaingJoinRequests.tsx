import { UIBasics } from "@/components/(UIBasics)";
import { Carousel } from "@/components/(UIBasics)/components";
import { CampaignJoinRequest, LintIgnoredAny } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useEffect, useState } from "react";
import { JoinRequestCard } from "./CampaignJoinRequest.components/JoinRequestCard";

interface CampaingJoinRequestsProps {
	campaignSlug: string;
}
export function CampaingJoinRequests({
	campaignSlug,
}: CampaingJoinRequestsProps) {
	const [requests, setRequests] = useState<CampaignJoinRequest[]>([]);

	useEffect(() => {
		(async () => {
			const response = await authenticatedFetchAsync(
				`/campaigns/${campaignSlug}/join-requests`,
			);
			if (!response.ok) return;
			const data: CampaignJoinRequest[] = await response.json();
			const requests = await Promise.all(
				data.map(async (request) => {
					const response = await fetch(
						getAlbinaApiFullAddress(`/users/id/${request.userId}`),
					);
					if (!response.ok) return null;
					request.user = (await response.json()).user;
					request.campaign = {
						id: request.campaignId,
						slug: campaignSlug,
					} as LintIgnoredAny;
					return request;
				}),
			);
			setRequests(requests.filter((request) => request != null));
		})();
	}, [campaignSlug, setRequests]);

	if (requests.length == 0) return null;
	return (
		<UIBasics.Box backgroundColor="darkGray">
			<UIBasics.Header
				headerType="h2"
				textAlign="center"
				textColor="green"
				backgroundColor="green">
				Pedidos de Entrada
			</UIBasics.Header>
			<Carousel
				slidesOrigin={"center"}
				slidesSpacing={10}
				minWidth={150}
				slideChilds={requests.map((request) => (
					<JoinRequestCard
						key={request.id}
						request={request}
					/>
				))}
			/>
		</UIBasics.Box>
	);
}
