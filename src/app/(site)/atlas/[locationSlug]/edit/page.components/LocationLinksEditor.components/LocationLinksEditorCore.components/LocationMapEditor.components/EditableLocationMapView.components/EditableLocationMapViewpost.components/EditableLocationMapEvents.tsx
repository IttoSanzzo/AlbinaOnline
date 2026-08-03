import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./EditableLocationMapEvents.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import { AddLocationLinkModal } from "../../../AddLocationLinkModal";
import { LocationData } from "@/libs/stp@types";
import { RelatedLocationLink } from "../../../../../LocationLinksEditor";

const EditableLocationMapEventsContainer = newStyledElement.div(
	styles.editableLocationMapEventsContainer,
);
const PositionDisplay = newStyledElement.div(styles.positionDisplay);

interface EditableLocationMapEventsProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function EditableLocationMapEvents({
	locationData,
	relatedLocationsState,
}: EditableLocationMapEventsProps) {
	const modalOpenState = useState<boolean>(false);
	const [mousePosition, setMousePosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });

	function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
		const rect = event.currentTarget.getBoundingClientRect();

		const x = Math.round(((event.clientX - rect.left) / rect.width) * 1000);
		const y = Math.round(((event.clientY - rect.top) / rect.height) * 1000);

		setMousePosition({
			x: Math.max(0, Math.min(1000, x)),
			y: Math.max(0, Math.min(1000, y)),
		});
	}

	return (
		<>
			<EditableLocationMapEventsContainer
				onMouseMove={onMouseMove}
				onClick={() => {
					modalOpenState[1](true);
				}}>
				<PositionDisplay>{`X: ${mousePosition.x}, Y: ${mousePosition.y}`}</PositionDisplay>
			</EditableLocationMapEventsContainer>
			<AddLocationLinkModal
				locationData={locationData}
				relatedLocationsState={relatedLocationsState}
				openState={modalOpenState}
				displayTriggerButton={false}
				defaultPosition={mousePosition}
			/>
		</>
	);
}
