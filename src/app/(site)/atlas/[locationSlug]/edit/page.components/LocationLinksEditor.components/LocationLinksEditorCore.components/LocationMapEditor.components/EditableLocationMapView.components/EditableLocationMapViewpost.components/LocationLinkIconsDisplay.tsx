import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./LocationLinkIconsDisplay.module.css";
import { RelatedLocationLink } from "../../../../../LocationLinksEditor";
import Image from "next/image";
import Link from "next/link";

const LocationLinkIconsDisplayContainer = newStyledElement.div(
	styles.locationLinkIconsDisplayContainer,
);
const FloatingIcon = newStyledElement.div(styles.floatingIcon);

interface LocationLinkIconsDisplayProps {
	relatedLocations: RelatedLocationLink[];
}
export function LocationLinkIconsDisplay({
	relatedLocations,
}: LocationLinkIconsDisplayProps) {
	return (
		<LocationLinkIconsDisplayContainer>
			{relatedLocations
				.filter((link) => link.isChild && link.displayData != undefined)
				.map((link) => (
					<FloatingIcon
						key={link.id}
						title={link.childLocation.name}
						style={{
							left: `${link.displayData!.x / 10}%`,
							top: `${link.displayData!.y / 10}%`,
						}}>
						<Link
							href={`/atlas/${link.childLocation.slug}`}
							target="_blank">
							<Image
								src={`${link.icon}?${Date.now()}`}
								alt=""
								sizes=""
								fill
							/>
						</Link>
					</FloatingIcon>
				))}
		</LocationLinkIconsDisplayContainer>
	);
}
