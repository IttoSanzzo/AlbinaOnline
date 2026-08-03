import styles from "./LocationLinkDisplay.module.css";
import { LocationData } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StyledLink } from "@/components/(Design)";
import Image from "next/image";
import { LocationLinkExpanded } from "@/libs/stp@types/dataTypes/locationLink";

const LocationLinkDisplayContainer = newStyledElement.div(
	styles.locationLinkDisplayContainer,
);
const IconContainer = newStyledElement.div(styles.iconContainer);
const IconView = newStyledElement.div(styles.iconView);

interface LocationLinkDisplayProps {
	locationLink: LocationLinkExpanded;
	isChild: boolean;
}
export async function LocationLinkDisplay({
	locationLink,
	isChild,
}: LocationLinkDisplayProps) {
	const targetLocation: LocationData = isChild
		? locationLink.childLocation
		: locationLink.parentLocation;
	return (
		<LocationLinkDisplayContainer>
			<StyledLink
				href={`/atlas/${targetLocation.slug}`}
				title={targetLocation.name}
				icon={targetLocation.iconUrl}
				containerClassName={styles.linkStyle}
				withEditLink
			/>

			<IconContainer>
				<IconView
					title={
						locationLink.displayData != undefined
							? `Type: ${locationLink.type}\nIconType: ${locationLink.iconType}\n\nX: ${locationLink.displayData.x}\nY: ${locationLink.displayData.y}\nSize: ${locationLink.displayData.size}\nRotation: ${locationLink.displayData.rotation}\nOpacity: ${locationLink.displayData.opacity}`
							: "Not Displayed"
					}>
					<Image
						src={locationLink.icon}
						alt=""
						sizes="100"
						fill
					/>
				</IconView>
			</IconContainer>
		</LocationLinkDisplayContainer>
	);
}
