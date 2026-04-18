"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ChangeIconButton } from "./subComponents/ChangeIconButton";
import { useState } from "react";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const EditablePageIconContainer = newStyledElement.div(
	styles.pageIconContainer,
);

interface EditablePageIconProps {
	iconSrc: string;
	route?: string;
	metadataTag?: string;
	borderColor?: string;
	borderOpacity: number;
	cacheTags?: string[];
	cachePaths?: string[];
}
export function EditablePageIcon({
	iconSrc,
	route,
	metadataTag,
	borderColor,
	borderOpacity,
	cachePaths,
	cacheTags,
}: EditablePageIconProps) {
	const [icon, setIcon] = useState<string>(`${iconSrc}?t=${Date.now()}`);

	return (
		<EditablePageIconContainer>
			<ImageWithTTL
				src={icon}
				alt="Page's icon"
				width={512}
				height={512}
				priority={true}
				quality={100}
				preload
				style={
					borderColor
						? {
								backgroundColor: `${borderColor}${borderOpacity}`,
							}
						: undefined
				}
			/>
			{route && route !== "" && (
				<ChangeIconButton
					setIcon={setIcon}
					iconSrc={iconSrc}
					route={route}
					metadataTag={metadataTag}
					cachePaths={cachePaths}
					cacheTags={cacheTags}
				/>
			)}
		</EditablePageIconContainer>
	);
}
