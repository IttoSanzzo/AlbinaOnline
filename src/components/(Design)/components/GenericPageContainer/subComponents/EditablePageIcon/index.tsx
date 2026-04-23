"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import {
	ChangeIconButton,
	ChangeIconButtonHandle,
} from "./subComponents/ChangeIconButton";
import { useRef, useState } from "react";
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
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const changeButtonRef = useRef<ChangeIconButtonHandle | null>(null);

	return (
		<EditablePageIconContainer>
			<ImageWithTTL
				src={icon}
				alt="Page's icon"
				width={512}
				height={512}
				quality={100}
				preload
				style={
					isDragging
						? {
								backgroundColor: "var(--cl-blue-500)",
							}
						: borderColor
							? {
									backgroundColor: `${borderColor}${borderOpacity}`,
								}
							: undefined
				}
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
					if (changeButtonRef.current)
						changeButtonRef.current.openByDragEvent(e);
				}}
			/>
			{route && route !== "" && (
				<ChangeIconButton
					ref={changeButtonRef}
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
