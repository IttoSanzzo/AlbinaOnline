"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import ImageBox, { GalleryImageActionFunction } from "../ImageBox";
import styles from "./styles.module.css";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { CarouselHandle } from "@/components/(UIBasics)/components/Carousel";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon } from "@/libs/stp@icons";
import { AddImageButton, AddImageButtonHandle } from "../AddImageButton";

const OpenFullViewButton = newStyledElement.button(styles.openFullViewButton);

interface GalleryCarouselProps {
	url: string;
	withoutMargin?: boolean;
	galleryData: GalleryData;
	isEditable?: boolean;
	reloadGalleryData?: () => Promise<boolean>;
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
		const [isDragging, setIsDragging] = useState<boolean>(false);
		const addButtonRef = useRef<AddImageButtonHandle | null>(null);

		return (
			<UIBasics.Box
				backgroundColor="darkGray"
				withoutBorder
				withoutMargin={withoutMargin}
				className={styles.galleryCarouselContainer}
				onDragEnter={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={(e) => {
					e.preventDefault();
					const toElement = e.relatedTarget as Node | null;
					if (toElement && e.currentTarget.contains(toElement)) return;
					setIsDragging(false);
				}}
				onDragOver={(e) => {
					e.preventDefault();
				}}
				onDrop={async (e) => {
					if (!isEditable) return;
					e.preventDefault();
					setIsDragging(false);
					if (addButtonRef.current) addButtonRef.current.openByDragEvent(e);
				}}>
				<UIBasics.Box
					style={
						isEditable && isDragging
							? {
									outline:
										"5px solid color-mix(in srgb, var(--cl-blue-500) 50%, transparent)",
								}
							: undefined
					}
					withoutMargin
					withoutPadding
					className={styles.galleryCarouselInternalContainer}>
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
						ref={addButtonRef}
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
