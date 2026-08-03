import styles from "./LocationLinkDeletionButton.module.css";
import { RelatedLocationLink } from "../../../LocationLinksEditor";
import { Dispatch, SetStateAction } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon } from "@/libs/stp@icons";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const LocationLinkDeletionButtonButton = newStyledElement.button(
	styles.locationLinkDeletionButtonButton,
);

interface LocationLinkDeletionButtonProps {
	locationLink: RelatedLocationLink;
	relatedLocationsState: [
		RelatedLocationLink[],
		Dispatch<SetStateAction<RelatedLocationLink[]>>,
	];
}
export function LocationLinkDeletionButton({
	locationLink,
	relatedLocationsState,
}: LocationLinkDeletionButtonProps) {
	return (
		<LocationLinkDeletionButtonButton
			onClick={async () => {
				const response = await authenticatedFetchAsync(
					getAlbinaApiFullAddress(`/atlas/location-links/${locationLink.id}`),
					{
						method: "DELETE",
					},
				);
				if (!response.ok) return;

				relatedLocationsState[1]((state) =>
					state.filter((link) => link.id != locationLink.id),
				);
				await revalidateTagByClientSide(`/atlas`);
				await revalidateTagByClientSide(`/atlas/location-links`);
			}}>
			<StpIcon
				name="Trash"
				color="red"
				style="duotone"
			/>
		</LocationLinkDeletionButtonButton>
	);
}
