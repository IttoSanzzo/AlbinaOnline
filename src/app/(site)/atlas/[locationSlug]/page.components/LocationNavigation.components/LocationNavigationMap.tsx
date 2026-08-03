import styles from "./LocationNavigationMap.module.css";
import { LocationDataWithExpandedLinks } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { LocationMapIcon } from "./LocationNavigationMap.components/LocationMapIcon";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const LocationNavigationMapContainer = newStyledElement.div(
	styles.locationNavigationMapContainer,
);
const SubContainer = newStyledElement.div(styles.subContainer);
const CoreContainer = newStyledElement.div(styles.coreContainer);
const MapImage = newStyledElement.div(styles.mapImage);

interface LocationNavigationMapProps {
	locationData: LocationDataWithExpandedLinks;
}
export async function LocationNavigationMap({
	locationData,
}: LocationNavigationMapProps) {
	return (
		<LocationNavigationMapContainer>
			<SubContainer>
				<CoreContainer>
					<MapImage>
						<ImageWithTTL
							ttlMs={1000 * 60 * 30}
							src={getAlbinaApiFullAddress(
								`/images/atlas/${locationData.slug}/location-map`,
							)}
							alt=""
							fill
						/>
					</MapImage>
					<LocationMapIcon
						locationId={locationData.id}
						locationLinks={locationData.childLocationLinks}
					/>
				</CoreContainer>
			</SubContainer>
		</LocationNavigationMapContainer>
	);
}
