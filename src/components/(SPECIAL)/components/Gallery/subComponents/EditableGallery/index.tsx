"use client";

import styles from "../../styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import GalleryCarousel from "../GalleryCarousel";
import AddImageButton from "../AddImageButton";
import { useEffect, useState } from "react";

interface EditableGalleryProps {
	url: string;
	withoutMargin?: boolean;
}
export default function EditableGallery({
	url,
	withoutMargin = false,
}: EditableGalleryProps) {
	const [galleryData, setGalleryData] = useState<GalleryData>({
		images: [],
		updatedAt: "",
	});

	async function reloadGalleryData() {
		const response = await fetch(url, {
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
					reloadGalleryData={reloadGalleryData}
				/>
			</UIBasics.Box>
			<AddImageButton
				url={url}
				reloadGalleryData={reloadGalleryData}
			/>
		</UIBasics.Box>
	);
}
