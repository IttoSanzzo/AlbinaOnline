import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./LocationMapIcon.module.css";
import Link from "next/link";
import { LocationLinkExpanded } from "@/libs/stp@types/dataTypes/locationLink";
import { Guid } from "@/libs/stp@types";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const LocationMapIconContainer = newStyledElement.div(
	styles.locationMapIconContainer,
);
const FloatingIcon = newStyledElement.div(styles.floatingIcon);

interface LocationMapIconProps {
	locationId: Guid;
	locationLinks: LocationLinkExpanded[];
}
export function LocationMapIcon({
	locationId,
	locationLinks,
}: LocationMapIconProps) {
	return (
		<LocationMapIconContainer>
			{locationLinks
				.filter((link) => link.displayData != undefined)
				.sort((a, b) => {
					const ay = Math.floor(a.displayData!.y / 50);
					const by = Math.floor(b.displayData!.y / 50);
					if (ay !== by) return ay - by;
					return a.displayData!.x - b.displayData!.x;
				})
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
						<Link href={`/atlas/${link.childLocation.slug}`}>
							<ImageWithTTL
								ttlMs={1000 * 60 * 60 * 60}
								src={link.icon}
								alt=""
								sizes=""
								fill
							/>
						</Link>
					</FloatingIcon>
				))}
		</LocationMapIconContainer>
	);
}
