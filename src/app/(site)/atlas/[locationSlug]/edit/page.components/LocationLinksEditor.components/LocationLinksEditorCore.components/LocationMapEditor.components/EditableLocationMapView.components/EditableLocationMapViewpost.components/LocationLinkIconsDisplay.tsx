import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./LocationLinkIconsDisplay.module.css";
import { RelatedLocationLink } from "../../../../../LocationLinksEditor";
import Image from "next/image";
import Link from "next/link";
import { Guid } from "@/libs/stp@types";

const LocationLinkIconsDisplayContainer = newStyledElement.div(
	styles.locationLinkIconsDisplayContainer,
);
const FloatingIcon = newStyledElement.div(styles.floatingIcon);

interface LocationLinkIconsDisplayProps {
	locationId: Guid;
	relatedLocations: RelatedLocationLink[];
}
export function LocationLinkIconsDisplay({
	locationId,
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
						className={
							link.childLocationId == locationId ? styles.selfLink : undefined
						}
						style={{
							left: `${link.displayData!.x / 10}%`,
							top: `${link.displayData!.y / 10}%`,
							transform: `translate(-50%, -50%) rotate(${link.displayData!.rotation}deg) scale(${link.displayData!.size / 100})`,
							opacity: link.displayData!.opacity / 100,
						}}>
						<Link
							href={`/atlas/${link.childLocation.slug}`}
							target="_blank">
							<Image
								src={`${link.icon}&${Date.now()}`}
								alt=""
								sizes="100"
								fill
							/>
						</Link>
					</FloatingIcon>
				))}
		</LocationLinkIconsDisplayContainer>
	);
}
