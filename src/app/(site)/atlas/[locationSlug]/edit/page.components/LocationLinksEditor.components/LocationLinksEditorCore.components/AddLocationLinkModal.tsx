import styles from "./AddLocationLinkModal.module.css";
import { LocationData } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "@/libs/stp@radix";
import { RelatedLocationLink } from "../../LocationLinksEditor";
import { HookedForm } from "@/libs/stp@forms";
import { LinkLocationForm } from "./AddLocationLinkModal.components/LinkLocationForm";
import { StateSwitch } from "@/components/(UTILS)";
import { CreateAndLinkLocationForm } from "./AddLocationLinkModal.components/CreateAndLinkLocationForm";

interface AddLocationLinkModalProps {
	locationData: LocationData;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
	openState: [boolean, Dispatch<SetStateAction<boolean>>];
	displayTriggerButton?: boolean;
	defaultPosition?: {
		x: number;
		y: number;
	};
}
export function AddLocationLinkModal({
	locationData,
	relatedLocationsState,
	openState,
	displayTriggerButton = true,
	defaultPosition,
}: AddLocationLinkModalProps) {
	const createBeforeLinkingState = useState<boolean>(false);

	return (
		<Dialog.Root open={openState[0]}>
			{displayTriggerButton && (
				<Dialog.Trigger
					className={styles.trigger}
					onClick={(event) => {
						event.preventDefault();
						openState[1](true);
					}}>
					Add Link
				</Dialog.Trigger>
			)}
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => openState[1](false)} />
				<Dialog.Content>
					<Dialog.Title textAlign="center">
						{createBeforeLinkingState[0] ? "Create and Link" : "Link"}
					</Dialog.Title>
					<HookedForm.Space />
					{createBeforeLinkingState[0] ? (
						<CreateAndLinkLocationForm
							locationData={locationData}
							openState={openState}
							relatedLocationsState={relatedLocationsState}
							defaultPosition={defaultPosition}
						/>
					) : (
						<LinkLocationForm
							locationData={locationData}
							openState={openState}
							relatedLocationsState={relatedLocationsState}
							defaultPosition={defaultPosition}
						/>
					)}
					<Dialog.Description />
					<StateSwitch
						label={"New Location"}
						state={createBeforeLinkingState}
						style={{
							position: "absolute",
							top: 0,
							right: 0,
						}}
					/>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
