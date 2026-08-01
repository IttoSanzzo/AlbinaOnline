import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { LocationData } from "../dataTypes/location";
import { LocationLink } from "../dataTypes/locationLink";

export async function loadRelatedLocationLinksFromLocationData(
	locationData: LocationData,
) {
	locationData.childLocationLinks = await loadRelatedLocationLinks(
		locationData.childLocationLinks,
	);
	locationData.parentLocationLinks = await loadRelatedLocationLinks(
		locationData.parentLocationLinks,
	);
}

export async function loadRelatedLocationLinks(
	unloadedLinks: LocationLink[],
): Promise<LocationLink[]> {
	const promises = unloadedLinks.map(async (link) => {
		console.log(link);
		const response = await fetch(
			getAlbinaApiFullAddress(`/atlas/location-links/${link.id}`),
			{
				next: {
					tags: [`/atlas/location-links/${link.id}`],
				},
			},
		);
		if (!response.ok) return null;
		return await response.json();
	});

	const data = await Promise.all(promises);
	return data.filter((link) => link != null);
}
