"use client";
import Image from "next/image";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ChangeIconButton } from "./subComponents/ChangeIconButton";
import { useState } from "react";

const EditablePageIconContainer = newStyledElement.div(
	styles.pageIconContainer
);

interface EditablePageIconProps {
	iconSrc: string;
	route?: string;
	metadataTag?: string;
}
export function EditablePageIcon({
	iconSrc,
	route,
	metadataTag,
}: EditablePageIconProps) {
	const [icon, setIcon] = useState<string>(`${iconSrc}?t=${Date.now()}`);

	return (
		<EditablePageIconContainer>
			<Image
				src={icon}
				alt="Page's icon"
				width={512}
				height={512}
				priority={true}
				quality={100}
			/>
			{route && route !== "" && (
				<ChangeIconButton
					setIcon={setIcon}
					iconSrc={iconSrc}
					route={route}
					metadataTag={metadataTag}
				/>
			)}
		</EditablePageIconContainer>
	);
}
