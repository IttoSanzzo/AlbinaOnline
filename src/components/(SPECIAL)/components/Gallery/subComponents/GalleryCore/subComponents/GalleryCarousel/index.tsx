"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import ImageBox, { GalleryImageActionFunction } from "../ImageBox";
import AddImageButton from "../AddImageButton";
import styles from "./styles.module.css";
import React, { Dispatch, SetStateAction } from "react";
import { CarouselHandle } from "@/components/(UIBasics)/components/Carousel";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon } from "@/libs/stp@icons";

const OpenFullViewButton = newStyledElement.button(styles.openFullViewButton);

interface GalleryCarouselProps {
	url: string;
	withoutMargin?: boolean;
	galleryData: GalleryData;
	isEditable?: boolean;
	reloadGalleryData?: () => Promise<void>;
	imageAction?: GalleryImageActionFunction;
	carouselRef?: React.RefObject<CarouselHandle | null>;
	setFullViewOpenState?: Dispatch<SetStateAction<boolean>>;
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
		setFullViewOpenState,
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
						maxWidth={"200px"}
						slideWidth={"200px"}
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
				<OpenFullViewButton
					onClick={() => {
						if (setFullViewOpenState) setFullViewOpenState(true);
					}}>
					<StpIcon
						name="ArrowsOut"
						color="purple"
						style="regular"
					/>
				</OpenFullViewButton>
			</UIBasics.Box>
		);
	},
	(oldProps, newProps) => {
		return oldProps.galleryData === newProps.galleryData;
	},
);
