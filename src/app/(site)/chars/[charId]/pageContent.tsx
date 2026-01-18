"use client";

import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { AccessLevel, CharacterExpandedData, Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import {
	Breadcrumb,
	SetBreadcrumbs,
	SetCurrentCharacterAccessLevel,
	SetCurrentPageData,
	SetNavBarModules,
	useCurrentCharacterAccessLevel,
} from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { routeInfra } from "./(routeInfra)";
import { useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { CharacterFullSheetEditableDisplay } from "./subComponents/CharacterFullEditableSheetDisplay";
import { CharacterFullSheetSocialDisplay } from "./subComponents/CharacterFullSheetSocialDisplay";
import { UserPageLink } from "@/components/(UTILS)";
import { CharacterForbidden } from "./subComponents/CharacterForbidden";

interface CharPageContentProps {
	characterId: Guid;
}
export default function CharPageContent({ characterId }: CharPageContentProps) {
	const [error, setError] = useState<number | null>(null);
	const [characterData, setCharacterData] =
		useState<CharacterExpandedData | null>(null);
	const { accessLevel } = useCurrentCharacterAccessLevel();

	useEffect(() => {
		authenticatedFetchAsync(`/chars/${characterId}?view=expanded`, {
			method: "GET",
		}).then((response) => {
			if (!response.ok) {
				setError(response.status);
			} else {
				response.json().then((data) => {
					setCharacterData(data.character);
				});
			}
		});
	}, [characterId, setCharacterData]);
	if (error != null) {
		switch (error) {
			case 403:
				return <CharacterForbidden characterId={characterId} />;
			case 404:
				return <>Not Found</>;
			case 500:
				return <>Interal Server Error</>;
			default:
				return <>Unknown</>;
		}
	}
	if (characterData == null) return null;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/chars",
			name: "Chars",
			icon: `${getAlbinaApiFullAddress()}/favicon/chars`,
		},
		{
			href: "#",
			name: characterData.name,
			icon: characterData.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title={characterData.name}
			banner={characterData.bannerUrl}
			icon={characterData.iconUrl}
			borderColor={"#505059"}
			isEditable={accessLevel >= AccessLevel.Edit}
			subTitle={<UserPageLink userId={characterData.ownerId} />}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/chars/${characterData.id}/banner`,
			)}
			iconChangeRoute={getAlbinaApiFullAddress(
				`/chars/${characterData.id}/favicon`,
			)}
			titleChangeRoute={getAlbinaApiFullAddress(
				`/chars/${characterData.id}/name`,
			)}
			metadataTag={`char-${characterData.id}`}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
			<SetNavBarModules
				contextMenuButton={routeInfra.PageContextMenu}
				favoriteButton={FavoriteButton}
			/>
			<SetCurrentPageData
				type={"character"}
				data={characterData}
			/>
			<SetCurrentCharacterAccessLevel characterId={characterData.id} />

			{accessLevel >= AccessLevel.Edit ? (
				<CharacterFullSheetEditableDisplay characterData={characterData} />
			) : (
				<CharacterFullSheetSocialDisplay characterData={characterData} />
			)}

			<GenericPageFooter
				version="6.5.0"
				lastUpdate={characterData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
