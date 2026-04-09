"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import ImageBox from "./subComponents/ImageBox";

interface GalleryCarouselProps {
	url: string;
	galleryData: GalleryData;
	reloadGalleryData?: () => Promise<void>;
}
export default function GalleryCarousel({
	url,
	galleryData,
	reloadGalleryData,
}: GalleryCarouselProps) {
	return (
		<UIBasics.Carousel
			slidesOrigin={galleryData.images.length > 1 ? "center" : "auto"}
			minWidth={"200px"}
			memoryId={galleryData.images.length > 1 ? url : undefined}
			slideChilds={galleryData.images.map((imageData) => (
				<ImageBox
					url={url}
					imageData={imageData}
					reloadGalleryData={reloadGalleryData}
				/>
			))}
		/>
	);
}
