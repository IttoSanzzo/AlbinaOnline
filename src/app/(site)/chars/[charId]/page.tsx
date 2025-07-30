"use client";

import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { AccessLevel, CharacterExpandedData } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
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
import { CharacterFullSheetSocialDisplay } from "./subComponents/CharaterFullSheetSocialDisplay";

// export const generateMetadata = routeInfra.generateMetadata;

interface CharacterPageProps {
	params: Promise<{ charId: string }>;
}
export default function Character({ params }: CharacterPageProps) {
	const [error, setError] = useState<number | null>(null);
	const [paramsData, setParamsData] = useState<{ charId: string } | null>(null);
	const [characterData, setCharacterData] =
		useState<CharacterExpandedData | null>(null);
	const { accessLevel } = useCurrentCharacterAccessLevel();

	useEffect(() => {
		params.then((paramsData) => setParamsData(paramsData));
	}, [setParamsData]);
	useEffect(() => {
		if (paramsData == null) return;
		authenticatedFetchAsync(`/chars/${paramsData.charId}?view=expanded`, {
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
	}, [paramsData, setCharacterData]);
	if (error != null) {
		switch (error) {
			case 403:
				return <>Forbidden</>;
			case 404:
				return <>Not Found</>;
			case 500:
				return <>Interal Server Error</>;
			default:
				return <>Unknown</>;
		}
	}
	if (paramsData == null || characterData == null) return null;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/chars",
			name: "Chars",
			icon: `${getAlbinaApiAddress()}/favicon/chars`,
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
			borderColor={"#505059"}>
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
				// <CharacterFullSheetEditableDisplay characterData={characterData} />
				<CharacterFullSheetSocialDisplay characterData={characterData} />
			)}

			<GenericPageFooter
				version="6.5.0"
				lastUpdate={characterData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
