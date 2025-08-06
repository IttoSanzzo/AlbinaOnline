"use client";
import Image from "next/image";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ChangeBannerButton } from "./subComponents/ChangeBannerButton";
import { useState } from "react";

export const EditablePageBannerContainer = newStyledElement.div(
	styles.pageBannerContainer
);
export const EditBannerButton = newStyledElement.button(
	styles.pageBannerContainer
);

interface EditablePageBannerProps {
	bannerSrc: string;
	route?: string;
}
export function EditablePageBanner({
	bannerSrc,
	route,
}: EditablePageBannerProps) {
	const [banner, setBanner] = useState<string>(`${bannerSrc}?t=${Date.now()}`);

	return (
		<EditablePageBannerContainer>
			<Image
				src={banner}
				alt="Page's banner"
				width={0}
				height={280}
				priority={true}
				sizes="(max-width: 100%)"
				fill={false}
				quality={100}
			/>
			{route && route !== "" && (
				<ChangeBannerButton
					setBanner={setBanner}
					bannerSrc={bannerSrc}
					route={route}
				/>
			)}
		</EditablePageBannerContainer>
	);
}
