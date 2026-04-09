"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import ImageBox, { GalleryImageActionFunction } from "../ImageBox";
import AddImageButton from "../AddImageButton";
import styles from "./styles.module.css";
import React from "react";
import { CarouselHandle } from "@/components/(UIBasics)/components/Carousel";

interface GalleryCarouselProps {
	url: string;
	withoutMargin?: boolean;
	galleryData: GalleryData;
	isEditable?: boolean;
	reloadGalleryData?: () => Promise<void>;
	imageAction?: GalleryImageActionFunction;
	carouselRef?: React.RefObject<CarouselHandle | null>;
}
export const GalleryCarousel = React.memo(
	function GalleryCarousel({
		url,
		galleryData,
		imageAction,
		isEditable,
		reloadGalleryData,
		withoutMargin,
		carouselRef,
	}: GalleryCarouselProps) {
		return (
			<UIBasics.Box
				backgroundColor="darkGray"
				withoutBorder
				withoutMargin={withoutMargin}
				classname={styles.galleryCarouselContainer}>
				<UIBasics.Box
					withoutMargin
					withoutPadding
					classname={styles.galleryCarouselInternalContainer}>
					<UIBasics.Carousel
						ref={carouselRef}
						slidesOrigin={galleryData.images.length > 1 ? "center" : "auto"}
						minWidth={"200px"}
						memoryId={galleryData.images.length > 1 ? url : undefined}
						slideChilds={galleryData.images.map((imageData) => (
							<ImageBox
								url={url}
								imageData={imageData}
								clickAction={imageAction}
							/>
						))}
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
	},
	(oldProps, newProps) => {
		return oldProps.galleryData === newProps.galleryData;
	},
);
