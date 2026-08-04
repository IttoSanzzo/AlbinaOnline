import styles from "./LocationNavigationMap.module.css";
import { LocationDataWithExpandedLinks } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { LocationMapIcon } from "./LocationNavigationMap.components/LocationMapIcon";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const LocationNavigationMapContainer = newStyledElement.div(
	styles.locationNavigationMapContainer,
);
const CoreContainer = newStyledElement.div(styles.coreContainer);
const MapImage = newStyledElement.div(styles.mapImage);

interface LocationNavigationMapProps {
	locationData: LocationDataWithExpandedLinks;
	topBorderRadius: boolean;
	bottomBorderRadius: boolean;
}
export async function LocationNavigationMap({
	locationData,
	bottomBorderRadius = true,
	topBorderRadius = true,
}: LocationNavigationMapProps) {
	return (
		<LocationNavigationMapContainer
			style={{
				...(topBorderRadius == false && {
					borderTopLeftRadius: "unset",
					borderTopRightRadius: "unset",
				}),
				...(bottomBorderRadius == false && {
					borderBottomLeftRadius: "unset",
					borderBottomRightRadius: "unset",
				}),
			}}>
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
		</LocationNavigationMapContainer>
	);
}
