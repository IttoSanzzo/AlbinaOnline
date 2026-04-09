import { useRef, useState } from "react";
import { GalleryCarousel } from "./subComponents/GalleryCarousel";
import { GalleryData } from "@/libs/stp@types";
import { GalleryImageModal } from "./subComponents/GalleryImageModal";
import { GalleryImageActionFunctionProps } from "./subComponents/ImageBox";
import { CarouselHandle } from "@/components/(UIBasics)/components/Carousel";

interface GalleryCoreProps {
	url: string;
	withoutMargin?: boolean;
	isEditable?: boolean;
	galleryData: GalleryData;
	reloadGalleryData?: () => Promise<void>;
}
export function GalleryCore({
	url,
	withoutMargin = false,
	isEditable = true,
	galleryData,
	reloadGalleryData,
}: GalleryCoreProps) {
	const carouselRef = useRef<CarouselHandle>(null);
	const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
	const [imageModalOpenState, setImageModalOpenState] =
		useState<boolean>(false);

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
