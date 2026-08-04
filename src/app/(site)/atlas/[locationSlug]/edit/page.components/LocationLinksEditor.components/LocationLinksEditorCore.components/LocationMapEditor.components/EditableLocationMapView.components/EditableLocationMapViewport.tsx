import styles from "./EditableLocationMapViewport.module.css";
import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "../../../../LocationLinksEditor";
import { Dispatch, SetStateAction } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import Image from "next/image";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { LocationLinkIconsDisplay } from "./EditableLocationMapViewpost.components/LocationLinkIconsDisplay";
import { EditableLocationMapEvents } from "./EditableLocationMapViewpost.components/EditableLocationMapEvents";

const EditableLocationMapViewportContainer = newStyledElement.div(
	styles.editableLocationMapViewportContainer,
);
const SubContainer = newStyledElement.div(styles.subContainer);
const CoreContainer = newStyledElement.div(styles.coreContainer);
const MapImage = newStyledElement.div(styles.mapImage);

interface EditableLocationMapViewportProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function EditableLoactionMapViewport({
	locationData,
	relatedLocationsState,
}: EditableLocationMapViewportProps) {
	return (
		<EditableLocationMapViewportContainer>
			<SubContainer>
				<CoreContainer>
					<MapImage>
						<Image
							src={getAlbinaApiFullAddress(
								`/images/atlas/${locationData.slug}/location-map?${Date.now()}`,
							)}
							alt="Location Map"
							sizes="100vw"
							preload
							fill
						/>
					</MapImage>
					<LocationLinkIconsDisplay
						locationId={locationData.id}
						relatedLocations={relatedLocationsState[0]}
					/>
					<EditableLocationMapEvents
						locationData={locationData}
						relatedLocationsState={relatedLocationsState}
					/>
				</CoreContainer>
			</SubContainer>
		</EditableLocationMapViewportContainer>
	);
}
