import styles from "./LocationNavigation.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { RelatedLocationsList } from "./LocationNavigation.components/RelatedLocationsList";
import { convertEnumsFromResponse } from "@/utils/Data";
import {
	loadRelatedLocationLinksFromLocationData,
	LocationData,
	LocationDataWithExpandedLinks,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { LocationNavigationMap } from "./LocationNavigation.components/LocationNavigationMap";

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
	else if (!hasLocationMap)
		return (
			<UIBasics.Box backgroundColor="darkGray">
				<RelatedLocationsList
					locationData={locationData as LocationDataWithExpandedLinks}
				/>
			</UIBasics.Box>
		);
	else if (
		locationData.childLocationLinks.length == 0 &&
		locationData.parentLocationLinks.length == 0
	)
		return (
			<UIBasics.Box backgroundColor="darkGray">
				<LocationNavigationMap
					locationData={locationData as LocationDataWithExpandedLinks}
				/>
			</UIBasics.Box>
		);
	return (
		<UIBasics.Box backgroundColor="darkGray">
			<UIBasics.MultiColumn.Two
				withoutPadding
				className={styles.twoColumnStyle}
				divisionRatio={2}
				colum1={
					<LocationNavigationMap
						locationData={locationData as LocationDataWithExpandedLinks}
					/>
				}
				colum2={
					<RelatedLocationsList
						locationData={locationData as LocationDataWithExpandedLinks}
					/>
				}
			/>
		</UIBasics.Box>
	);
}
