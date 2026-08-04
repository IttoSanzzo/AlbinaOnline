import { UIBasics } from "@/components/(UIBasics)";
import { RelatedLocationsList } from "./LocationNavigation.components/RelatedLocationsList";
import { convertEnumsFromResponse } from "@/utils/Data";
import {
	loadRelatedLocationLinksFromLocationData,
	LocationData,
	LocationDataWithExpandedLinks,
	LocationType,
	sortLocationLinkExpandedArrayByProximity,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { LocationNavigationMap } from "./LocationNavigation.components/LocationNavigationMap";
import { LocationLinkExpanded } from "@/libs/stp@types/dataTypes/locationLink";

interface LocationNavigationProps {
	locationSlug: string;
}
export async function LocationNavigation({
	locationSlug,
}: LocationNavigationProps) {
	const response = await fetch(
		getAlbinaApiFullAddress(`/atlas/${locationSlug}`),
		{
			cache: getCacheMode(),
			next: { tags: [`/atlas/${locationSlug}`] },
		},
	);
	if (!response.ok) return null;
	const locationData = convertEnumsFromResponse<LocationData>(
		await response.json(),
	);
	await loadRelatedLocationLinksFromLocationData(locationData);

	const hasLocationMapResponse = await fetch(
		getAlbinaApiFullAddress(`/images/atlas/${locationData.slug}/location-map`),
		{
			method: "HEAD",
			next: { tags: [`/images/atlas/${locationData.slug}/location-map`] },
		},
	);
	const hasLocationMap = hasLocationMapResponse.ok;

	if (
		!hasLocationMap &&
		locationData.childLocationLinks.length == 0 &&
		locationData.parentLocationLinks.length == 0
	)
		return null;

	const parentLinks = sortLocationLinkExpandedArrayByProximity(
		(locationData as LocationDataWithExpandedLinks).parentLocationLinks.filter(
			(link: LocationLinkExpanded) => link.parentLocationId != locationData.id,
		),
		LocationType[locationData.type],
	);
	const childLinks = sortLocationLinkExpandedArrayByProximity(
		locationData.childLocationLinks as LocationLinkExpanded[],
		LocationType[locationData.type],
	);

	return (
		<UIBasics.Box backgroundColor="darkGray">
			{parentLinks.length > 0 && (
				<RelatedLocationsList
					locationLinks={parentLinks}
					type="parents"
					topBorderRadius
					bottomBorderRadius={!(childLinks.length > 0) && !hasLocationMap}
				/>
			)}
			{hasLocationMap && (
				<LocationNavigationMap
					locationData={locationData as LocationDataWithExpandedLinks}
					topBorderRadius={!(parentLinks.length > 0)}
					bottomBorderRadius={!(childLinks.length > 0)}
				/>
			)}
			{childLinks.length > 0 && (
				<RelatedLocationsList
					locationLinks={childLinks}
					type="children"
					topBorderRadius={!(parentLinks.length > 0) && !hasLocationMap}
					bottomBorderRadius
				/>
			)}
		</UIBasics.Box>
	);
}
