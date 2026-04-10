"use client";

import { GalleryCore } from "../subComponents/GalleryCore";

interface DynamicGalleryProps {
	url: string;
	withoutMargin?: boolean;
	isEditable?: boolean;
}
export default function DynamicGallery({
	url,
	withoutMargin = false,
	isEditable = true,
}: DynamicGalleryProps) {
	return (
		<GalleryCore
			url={url}
			isEditable={isEditable}
			withoutMargin={withoutMargin}
		/>
	);
}
