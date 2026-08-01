import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { LocationData } from "@/libs/stp@types";

const RelatedLocationsListContainer = newStyledElement.div(
	styles.relatedLocationsListContainer,
);

interface RelatedLocationsListProps {
	locationData: LocationData;
}
export async function RelatedLocationsList({
	locationData,
}: RelatedLocationsListProps) {
	void locationData;
	return <RelatedLocationsListContainer></RelatedLocationsListContainer>;
}
