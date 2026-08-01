"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { loadRelatedLocationLinks, LocationData } from "@/libs/stp@types";
import { LocationLinkExpanded } from "@/libs/stp@types/dataTypes/locationLink";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LocationLinksEditorCore } from "./LocationLinksEditorCore.sub";

export interface RelatedLocationLink extends LocationLinkExpanded {
	isChild: boolean;
}

interface LocationLinksEditorProps {
	locationData: LocationData;
}
export function LocationLinksEditor({
	locationData,
}: LocationLinksEditorProps) {
	const relatedLocationsState = useState<RelatedLocationLink[] | null>(null);

	useEffect(() => {
		(async () => {
			const childLinks = await loadRelatedLocationLinks(
				locationData.childLocationLinks,
			);
			const parentLinks = await loadRelatedLocationLinks(
				locationData.parentLocationLinks.filter(
					(link) => link.parentLocationId != locationData.id,
				),
			);
			relatedLocationsState[1]([
				...childLinks.map((link) => ({ ...link, isChild: true })),
				...parentLinks.map((link) => ({ ...link, isChild: false })),
			]);
		})();
	}, [locationData, relatedLocationsState[1]]);

	if (relatedLocationsState[0] == null) return null;
	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutBorder>
			<LocationLinksEditorCore
				locationData={locationData}
				relatedLocationsState={
					relatedLocationsState as [
						RelatedLocationLink[],
						Dispatch<SetStateAction<RelatedLocationLink[]>>,
					]
				}
			/>
		</UIBasics.Box>
	);
}
