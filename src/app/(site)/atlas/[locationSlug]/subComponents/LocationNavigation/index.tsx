import { UIBasics } from "@/components/(UIBasics)";
import { RelatedLocationsList } from "./subComponents/RelatedLocationsList";
import { LocationNavigationMap } from "./subComponents/LocationNavigationMap";
import { convertEnumsFromResponse } from "@/utils/Data";
import {
	loadRelatedLocationLinksFromLocationData,
	LocationData,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";

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

	return (
		<UIBasics.Box backgroundColor="darkGray">
			<UIBasics.MultiColumn.Two
				withoutPadding
				divisionRatio={2}
				colum1={<LocationNavigationMap locationSlug={locationSlug} />}
				colum2={<RelatedLocationsList locationData={locationData} />}
			/>
		</UIBasics.Box>
	);
}
