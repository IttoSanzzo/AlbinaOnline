import styles from "./LocationLinksEditorCore.module.css";
import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "./LocationLinksEditor.sub";
import { Dispatch, SetStateAction, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { AddLocationLinkModal } from "./AddLocationLinkModal.sub";

const LocationLinksEditorCoreContainer = newStyledElement.div(
	styles.locationLinksEditorCoreContainer,
);

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

	return (
		<LocationLinksEditorCoreContainer>
			<button
				onClick={(event) => {
					event.preventDefault();
					modalOpenState[1](true);
				}}>
				Yabeee
			</button>
			<AddLocationLinkModal
				locationData={locationData}
				relatedLocationsState={relatedLocationsState}
				openState={modalOpenState}
			/>
			<div>
				{relatedLocationsState[0].map((link) => (
					<div
						key={`${link.isChild}|${link.id}`}
						style={{ width: "100%" }}>
						{`${link.isChild}|${link.id}`}
					</div>
				))}
			</div>
		</LocationLinksEditorCoreContainer>
	);
}
