import styles from "./LocationLinkEditor.module.css";
import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "../../LocationLinksEditor";
import { Dispatch, SetStateAction } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StyledLink } from "@/components/(Design)";
import { LocationLinkDeletionButton } from "./LocationLinkEditor.components/LocationLinkDeletionButton";
import { EditLocationLinkModal } from "./LocationLinkEditor.components/EditLocationLinkModal";
import Image from "next/image";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const LocationLinkEditorContainer = newStyledElement.div(
	styles.locationLinkEditorContainer,
);
const EditorRightContainer = newStyledElement.div(styles.editorRightContainer);
const IconView = newStyledElement.div(styles.iconView);

interface LocationLinkEditorProps {
	locationLink: RelatedLocationLink;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function LocationLinkEditor({
	locationLink,
	relatedLocationsState,
}: LocationLinkEditorProps) {
	const targetLocation: LocationData = locationLink.isChild
		? locationLink.childLocation
		: locationLink.parentLocation;
	return (
		<LocationLinkEditorContainer>
			<StyledLink
				href={`/atlas/${targetLocation.slug}`}
				title={targetLocation.name}
				icon={targetLocation.iconUrl}
				containerClassName={styles.linkStyle}
			/>
			<EditorRightContainer>
				<IconView
					title={
						locationLink.displayData != undefined
							? `X: ${locationLink.displayData.x}\nY: ${locationLink.displayData.y}\nRotation: ${locationLink.displayData.rotation}\nOpacity: ${locationLink.displayData.opacity}`
							: "Not Displayed"
					}>
					<Image
						src={getAlbinaApiFullAddress(
							`/images/atlas/markers/${locationLink.iconType}`,
						)}
						alt=""
						sizes="100"
						fill
					/>
				</IconView>
				<EditLocationLinkModal
					locationLink={locationLink}
					relatedLocationsState={relatedLocationsState}
				/>
				<LocationLinkDeletionButton
					locationLink={locationLink}
					relatedLocationsState={relatedLocationsState}
				/>
			</EditorRightContainer>
		</LocationLinkEditorContainer>
	);
}
