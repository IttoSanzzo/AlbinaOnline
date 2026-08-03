import styles from "./LocationLinksEditorCore.module.css";
import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "../LocationLinksEditor";
import { Dispatch, SetStateAction, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { UIBasics } from "@/components/(UIBasics)";
import { AddLocationLinkModal } from "./LocationLinksEditorCore.components/AddLocationLinkModal";
import { LocationLinkEditor } from "./LocationLinksEditorCore.components/LocationLinkEditor";
import { LocationMapEditor } from "./LocationLinksEditorCore.components/LocationMapEditor";

const LocationLinksEditorCoreContainer = newStyledElement.div(
	styles.locationLinksEditorCoreContainer,
);
const LinksContainer = newStyledElement.div(styles.linksContainer);

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
									locationLink={link}
									relatedLocationsState={relatedLocationsState}
								/>
							))}
						</UIBasics.List.Grid>
					</UIBasics.Box>
				)}
			</LinksContainer>
			<LocationMapEditor
				locationData={locationData}
				relatedLocationsState={relatedLocationsState}
			/>
		</LocationLinksEditorCoreContainer>
	);
}
