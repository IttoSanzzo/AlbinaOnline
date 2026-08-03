import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./LocationNavigationMap.module.css";

const LocationNavigationMapContainer = newStyledElement.div(
	styles.locationNavigationMapContainer,
);

interface LocationNavigationMapProps {
	locationSlug: string;
}
export function LocationNavigationMap({
	locationSlug,
}: LocationNavigationMapProps) {
	void locationSlug;
	return <LocationNavigationMapContainer>1</LocationNavigationMapContainer>;
}
