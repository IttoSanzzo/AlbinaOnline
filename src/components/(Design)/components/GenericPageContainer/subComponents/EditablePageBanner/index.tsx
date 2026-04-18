"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ChangeBannerButton } from "./subComponents/ChangeBannerButton";
import { useState } from "react";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const EditablePageBannerContainer = newStyledElement.div(
	styles.pageBannerContainer,
);

export interface EditablePageBannerProps {
	bannerSrc: string;
	route?: string;
	cacheTags?: string[];
	cachePaths?: string[];
}
export function EditablePageBanner({
	bannerSrc,
	route,
	cachePaths,
	cacheTags,
}: EditablePageBannerProps) {
	const [banner, setBanner] = useState<string>(`${bannerSrc}?t=${Date.now()}`);

	return (
		<EditablePageBannerContainer>
			<ImageWithTTL
				src={banner}
				alt="Page's banner"
				priority={true}
				sizes="100vw"
				fill={true}
				quality={90}
				preload
			/>
			{route && route !== "" && (
				<ChangeBannerButton
					setBanner={setBanner}
					bannerSrc={bannerSrc}
					route={route}
					cachePaths={cachePaths}
					cacheTags={cacheTags}
				/>
			)}
		</EditablePageBannerContainer>
	);
}
