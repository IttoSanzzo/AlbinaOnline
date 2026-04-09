"use client";

import { GalleryData } from "@/libs/stp@types";
import { useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
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
	const [galleryData, setGalleryData] = useState<GalleryData>({
		images: [],
		updatedAt: "",
	});

	async function reloadGalleryData() {
		const response = await authenticatedFetchAsync(url, {
			method: "GET",
			next: {
				tags: [url],
			},
		});
		if (response.ok) setGalleryData(await response.json());
	}
	useEffect(() => {
		reloadGalleryData();
	}, []);

	return (
		<GalleryCore
			url={url}
			isEditable={isEditable}
			withoutMargin={withoutMargin}
			galleryData={galleryData}
			reloadGalleryData={reloadGalleryData}
		/>
	);
}
