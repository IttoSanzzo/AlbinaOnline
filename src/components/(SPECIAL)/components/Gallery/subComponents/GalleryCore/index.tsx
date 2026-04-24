"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { GalleryCarousel } from "./subComponents/GalleryCarousel";
import { GalleryData } from "@/libs/stp@types";
import { GalleryImageModal } from "./subComponents/GalleryImageModal";
import { GalleryImageActionFunctionProps } from "./subComponents/ImageBox";
import { CarouselHandle } from "@/components/(UIBasics)/components/Carousel";
import { GalleryFullViewModal } from "./subComponents/GalleryFullViewModal";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useEventBusUpdated } from "@/libs/stp@hooks/hooks/useEventBusUpdated";

interface GalleryCoreProps {
	url: string;
	withoutMargin?: boolean;
	isEditable?: boolean;
	galleryData?: GalleryData;
}
export function GalleryCore({
	url,
	withoutMargin = false,
	isEditable = true,
	...rest
}: GalleryCoreProps) {
	const [galleryData, setGalleryData] = useState<GalleryData>(
		rest.galleryData ?? {
			images: [],
			updatedAt: "",
		},
	);
	const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
	const [imageModalOpenState, setImageModalOpenState] =
		useState<boolean>(false);
	const [fullViewOpenState, setFullViewOpenState] = useState<boolean>(false);
	const carouselRef = useRef<CarouselHandle>(null);

	async function reloadGalleryData(): Promise<boolean> {
		const response = await authenticatedFetchAsync(url, {
			method: "GET",
			next: {
				tags: [url],
			},
		});
		if (response.ok) setGalleryData(await response.json());
		return response.ok;
	}
	useEventBusUpdated(url, reloadGalleryData);

	useLayoutEffect(() => {
		if (galleryData.updatedAt != "") return;
		reloadGalleryData();
	}, []);

	function moveImageCarousel(index: number) {
		if (carouselRef.current) carouselRef.current.moveTo(index);
	}

	function handleImageClickEvent({
		imageData,
	}: GalleryImageActionFunctionProps) {
		const imageIndex = galleryData.images.findIndex(
			(image) => image.id == imageData.id,
		);
		const newIndex = imageIndex != -1 ? imageIndex : 0;
		setActiveImageIndex(newIndex);
		setImageModalOpenState(true);
		if (carouselRef.current) carouselRef.current.moveTo(newIndex);
	}

	return (
		<>
			<GalleryCarousel
				galleryData={galleryData}
				url={url}
				imageAction={handleImageClickEvent}
				isEditable={isEditable}
				reloadGalleryData={reloadGalleryData}
				withoutMargin={withoutMargin}
				carouselRef={carouselRef}
				setFullViewOpenState={setFullViewOpenState}
			/>
			<GalleryFullViewModal
				url={url}
				galleryData={galleryData}
				setGalleryData={setGalleryData}
				openState={[fullViewOpenState, setFullViewOpenState]}
				imageAction={handleImageClickEvent}
				reloadGalleryData={reloadGalleryData}
				isEditable={isEditable}
			/>
			<GalleryImageModal
				url={url}
				galleryData={galleryData}
				openState={[imageModalOpenState, setImageModalOpenState]}
				imageIndexState={[activeImageIndex, setActiveImageIndex]}
				reloadGalleryData={reloadGalleryData}
				moveImageCarousel={moveImageCarousel}
			/>
		</>
	);
}
