"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import Image from "next/image";
import GearMicCrop from "@/../public/general-assets/GearMicCrop.png";
import { useCurrentUser } from "@/libs/stp@hooks";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const MuteButtonContainer = newStyledElement.button(styles.muteButtonContainer);

export function MuteButton() {
	const { loading, externalLogins } = useCurrentUser();
	if (loading || externalLogins == null || !externalLogins["discord"])
		return null;

	return (
		<MuteButtonContainer
			onClick={async () => {
				await authenticatedFetchAsync(
					getAlbinaApiFullAddress("/peer-out/ChariotSanzzo/peer-in/mute-me"),
					{
						method: "POST",
					},
				);
			}}>
			<Image
				src={GearMicCrop}
				alt="Mute Mic"
				width={50}
				height={50}
				priority
			/>
		</MuteButtonContainer>
	);
}
