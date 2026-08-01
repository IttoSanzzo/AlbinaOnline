import styles from "./LocationLinksEditorCore.module.css";
import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "./LocationLinksEditor.sub";
import { Dispatch, SetStateAction, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { AddLocationLinkModal } from "./AddLocationLinkModal.sub";
import { UIBasics } from "@/components/(UIBasics)";
import { LocationLinkEditor } from "./LocationLinkEditor.sub";

const LocationLinksEditorCoreContainer = newStyledElement.div(
	styles.locationLinksEditorCoreContainer,
);
const LinksContainer = newStyledElement.div(styles.linksContainer);
const OpenModalButton = newStyledElement.button(styles.openModalButton);

interface LocationLinksEditorCoreProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function LocationLinksEditorCore({
	locationData,
	relatedLocationsState,
}: LocationLinksEditorCoreProps) {
	const modalOpenState = useState<boolean>(false);

	const parentLinks = relatedLocationsState[0].filter((link) => !link.isChild);
	const childLinks = relatedLocationsState[0].filter((link) => link.isChild);

	return (
		<LocationLinksEditorCoreContainer>
			<AddLocationLinkModal
				locationData={locationData}
				relatedLocationsState={relatedLocationsState}
				openState={modalOpenState}
			/>
			<OpenModalButton
				onClick={(event) => {
					event.preventDefault();
					modalOpenState[1](true);
				}}>
				Add Link
			</OpenModalButton>
			<LinksContainer>
				{parentLinks.length > 0 && (
					<UIBasics.Box
						withoutBorder
						backgroundColor="gray">
						<UIBasics.Header
							children={"Parents"}
							headerType="h3"
							textAlign="center"
							textColor="gray"
						/>
						<UIBasics.List.Grid
							backgroundColor="darkGray"
							withoutMargin
							columnWidth={400}
							className={styles.gridStyle}>
							{parentLinks.map((link) => (
								<LocationLinkEditor
									key={link.id}
									locationData={locationData}
									locationLink={link}
									relatedLocationsState={relatedLocationsState}
								/>
							))}
						</UIBasics.List.Grid>
					</UIBasics.Box>
				)}
				{childLinks.length > 0 && (
					<UIBasics.Box
						withoutBorder
						backgroundColor="gray"
						withoutMargin>
						<UIBasics.Header
							children={"Children"}
							headerType="h3"
							textAlign="center"
							textColor="gray"
						/>
						<UIBasics.List.Grid
							backgroundColor="darkGray"
							withoutMargin
							columnWidth={400}
							className={styles.gridStyle}>
							{childLinks.map((link) => (
								<LocationLinkEditor
									key={link.id}
									locationData={locationData}
									locationLink={link}
									relatedLocationsState={relatedLocationsState}
								/>
							))}
						</UIBasics.List.Grid>
					</UIBasics.Box>
				)}
			</LinksContainer>
		</LocationLinksEditorCoreContainer>
	);
}
