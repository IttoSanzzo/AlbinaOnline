"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import {
	ChangeBannerButton,
	ChangeBannerButtonHandle,
} from "./subComponents/ChangeBannerButton";
import { useRef, useState } from "react";
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
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const changeButtonRef = useRef<ChangeBannerButtonHandle | null>(null);

	return (
		<EditablePageBannerContainer
			onDragEnter={(e) => {
				e.preventDefault();
				setIsDragging(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				const toElement = e.relatedTarget as Node | null;
				if (toElement && e.currentTarget.contains(toElement)) return;
				setIsDragging(false);
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={async (e) => {
				e.preventDefault();
				setIsDragging(false);
				if (changeButtonRef.current) changeButtonRef.current.openByDragEvent(e);
			}}
			style={
				isDragging
					? {
							outline: "5px solid var(--cl-blue-500)",
						}
					: undefined
			}>
			<ImageWithTTL
				src={banner}
				alt="Page's banner"
				sizes="100vw"
				fill={true}
				quality={90}
				preload
			/>
			{route && route !== "" && (
				<ChangeBannerButton
					ref={changeButtonRef}
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
