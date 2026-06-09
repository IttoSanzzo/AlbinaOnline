"use client";

import { GalleryCore } from "../subComponents/GalleryCore";

interface DynamicGalleryProps {
	url: string;
	withoutMargin?: boolean;
	hideIfEmpty?: boolean;
	isEditable?: boolean;
}
export default function DynamicGallery({
	url,
	withoutMargin = false,
	hideIfEmpty = false,
	isEditable = true,
}: DynamicGalleryProps) {
	return (
		<GalleryCore
			url={url}
			isEditable={isEditable}
			withoutMargin={withoutMargin}
			hideIfEmpty={hideIfEmpty}
		/>
	);
}
