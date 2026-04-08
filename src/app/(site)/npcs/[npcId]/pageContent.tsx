"use client";

import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { AccessLevel, Guid, NpcExpandedData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import {
	Breadcrumb,
	SetBreadcrumbs,
	SetCurrentNpcAccessLevel,
	SetCurrentPageData,
	SetNavBarModules,
	useCurrentNpcAccessLevel,
	useNpcUpdated,
	useNpcUpdatedPolling,
} from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { routeInfra } from "./(routeInfra)";
import { useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { UserPageLink } from "@/components/(UTILS)";
import { NpcForbidden } from "./subComponents/NpcForbidden";

interface NpcPageContentProps {
	npcId: Guid;
}
export default function NpcPageContent({ npcId }: NpcPageContentProps) {
	const [error, setError] = useState<number | null>(null);
	const [npcData, setNpcData] = useState<NpcExpandedData | null>(null);
	// const [npcData, setNpcData] = useState<NpcExpandedData | null>({
	// 	bannerUrl:getAlbinaApiFullAddress("/favicon/npcs/"),
	// });
	const { accessLevel } = useCurrentNpcAccessLevel();
	useNpcUpdatedPolling(npcId);

	async function loadNpcAsync(): Promise<boolean> {
		const response = await authenticatedFetchAsync(
			`/npcs/${npcId}?view=expanded`,
			{
				method: "GET",
				next: { tags: [`/npcs/${npcId}`] },
			},
		);
		if (!response.ok) {
			setError(response.status);
			return false;
		}
		const data = await response.json();
		setNpcData(data.npc);
		return true;
	}

	useNpcUpdated(npcId, async () => {
		return await loadNpcAsync();
	});

	useEffect(() => {
		loadNpcAsync();
	}, [npcId, setNpcData]);
	if (error != null) {
		switch (error) {
			case 403:
				return <NpcForbidden npcId={npcId} />;
			case 404:
				return <>Not Found</>;
			case 500:
				return <>Interal Server Error</>;
			default:
				return <>Unknown</>;
		}
	}
	if (npcData == null) return null;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/npcs",
			name: "Npcs",
			icon: getAlbinaApiFullAddress("/favicon/npcs"),
		},
		{
			href: "#",
			name: npcData.name,
			icon: npcData.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title={npcData.name}
			banner={npcData.bannerUrl}
			icon={npcData.iconUrl}
			borderColor={"#505059"}
			isEditable={accessLevel >= AccessLevel.Edit}
			subTitle={<UserPageLink userId={npcData.ownerId} />}
			bannerChangeRoute={getAlbinaApiFullAddress(`/npcs/${npcData.id}/banner`)}
			iconChangeRoute={getAlbinaApiFullAddress(`/npcs/${npcData.id}/favicon`)}
			titleChangeRoute={getAlbinaApiFullAddress(`/npcs/${npcData.id}/name`)}
			metadataTag={`char-${npcData.id}`}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
			<SetNavBarModules
				contextMenuButton={routeInfra.PageContextMenu}
				favoriteButton={FavoriteButton}
			/>
			<SetCurrentPageData
				type={"npc"}
				data={npcData}
			/>
			<SetCurrentNpcAccessLevel npcId={npcData.id} />

			{/* {accessLevel >= AccessLevel.Edit ? (
				<NpcFullSheetEditableDisplay npcData={npcData} />
			) : (
				<NpcFullSheetSocialDisplay npcData={npcData} />
			)} */}

			<GenericPageFooter
				version="7.5.0"
				lastUpdate={npcData.updatedAt}
				lastUpdateWithHour
				lastUpdateWithMinute
				lastUpdateWithSecond
			/>
		</GenericPageContainer>
	);
}
