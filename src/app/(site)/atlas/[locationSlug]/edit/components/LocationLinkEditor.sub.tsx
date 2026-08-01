import styles from "./LocationLinkEditor.module.css";
import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "./LocationLinksEditor.sub";
import { Dispatch, SetStateAction } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StyledLink } from "@/components/(Design)";
import { LocationLinkDeletionButton } from "./LocationLinkDeletionButton.sub";
import { EditLocationLinkModal } from "./EditLocationLinkModal.sub";
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
				<IconView>
					<Image
						src={getAlbinaApiFullAddress(
							`/images/target/atlas/markers/${locationLink.iconType}`,
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
