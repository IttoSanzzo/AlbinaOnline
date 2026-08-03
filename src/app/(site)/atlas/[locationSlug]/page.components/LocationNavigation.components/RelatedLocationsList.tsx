import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./RelatedLocationsList.module.css";
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
	return (
		<RelatedLocationsListContainer>
			{locationData.parentLocationLinks.map((link) => (
				<div key={link.id}>{link.id}</div>
			))}
			<br />
			<br />
			{locationData.childLocationLinks.map((link) => (
				<div key={link.id}>{link.id}</div>
			))}
		</RelatedLocationsListContainer>
	);
}
