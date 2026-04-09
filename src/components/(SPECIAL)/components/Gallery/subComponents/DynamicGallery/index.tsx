"use client";

import styles from "../../styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import GalleryCarousel from "../GalleryCarousel";
import AddImageButton from "../AddImageButton";
import { useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";

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
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutBorder
			withoutMargin={withoutMargin}
			classname={styles.galleryContainer}>
			<UIBasics.Box
				withoutMargin
				withoutPadding
				classname={styles.galleryInternalContainer}>
				<GalleryCarousel
					galleryData={galleryData}
					url={url}
					reloadGalleryData={isEditable ? reloadGalleryData : undefined}
				/>
			</UIBasics.Box>
			{isEditable && (
				<AddImageButton
					url={url}
					reloadGalleryData={reloadGalleryData}
				/>
			)}
		</UIBasics.Box>
	);
}
