import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { LocationData } from "../dataTypes/location";
import { LocationLink, LocationLinkExpanded } from "../dataTypes/locationLink";
import { Guid } from "../misc/Guid";

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
): Promise<LocationLinkExpanded[]> {
	const promises = unloadedLinks.map(
		async (link) => await loadRelatedLocationLink(link.id),
	);

	const data = await Promise.all(promises);
	return data.filter((link) => link != null);
}

export async function loadRelatedLocationLink(
	locationLinkId: Guid,
): Promise<LocationLinkExpanded | null> {
	const response = await fetch(
		getAlbinaApiFullAddress(`/atlas/location-links/${locationLinkId}`),
		{
			next: {
				tags: [`/atlas/location-links`],
			},
		},
	);
	if (!response.ok) return null;
	return await response.json();
}
