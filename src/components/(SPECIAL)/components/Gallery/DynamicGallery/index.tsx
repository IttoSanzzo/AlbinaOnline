"use client";

import { CSSProperties } from "react";
import { GalleryCore } from "../subComponents/GalleryCore";

interface DynamicGalleryProps {
	url: string;
	withoutMargin?: boolean;
	hideIfEmpty?: boolean;
	isEditable?: boolean;
	style?: CSSProperties;
}
export default function DynamicGallery({
	url,
	withoutMargin = false,
	hideIfEmpty = false,
	isEditable = true,
	style,
}: DynamicGalleryProps) {
	return (
		<GalleryCore
			style={style}
			url={url}
			isEditable={isEditable}
			withoutMargin={withoutMargin}
			hideIfEmpty={hideIfEmpty}
		/>
	);
}
