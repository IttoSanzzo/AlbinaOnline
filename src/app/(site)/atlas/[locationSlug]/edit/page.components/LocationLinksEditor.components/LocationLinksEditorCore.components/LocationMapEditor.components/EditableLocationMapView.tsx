import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "../../../LocationLinksEditor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { EditableLoactionMapViewport } from "./EditableLocationMapView.components/EditableLocationMapViewport";

interface EditableLocationMapViewProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function EditableLocationMapView({
	locationData,
	relatedLocationsState,
}: EditableLocationMapViewProps) {
	const [hasLocationMapImage, setHasLocationMapImage] =
		useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(
					`/images/atlas/${locationData.slug}/location-map`,
				),
				{
					method: "HEAD",
					next: {
						tags: [`/images/atlas/${locationData.slug}/location-map`],
					},
				},
			);
			setHasLocationMapImage(response.ok);
		})();
	}, [locationData.slug]);

	if (!hasLocationMapImage) return null;
	return (
		<EditableLoactionMapViewport
			locationData={locationData}
			relatedLocationsState={relatedLocationsState}
		/>
	);
}
