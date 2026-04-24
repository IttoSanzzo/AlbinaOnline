"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { GalleryImageData } from "@/libs/stp@types";
import Image from "next/image";
import { LazyLoadWrapper } from "@/components/(UTILS)/components/LazyLoadWrapper";
import styles from "./styles.module.css";

export interface GalleryImageActionFunctionProps {
	event: unknown;
	url: string;
	imageData: GalleryImageData;
}
export type GalleryImageActionFunction = (
	data: GalleryImageActionFunctionProps,
) => void;

export interface ImageBoxProps {
	url: string;
	imageData: GalleryImageData;
	clickAction?: GalleryImageActionFunction;
	withoutMargin?: boolean;
}
export default function ImageBox({
	url,
	imageData,
	clickAction,
	withoutMargin = false,
}: ImageBoxProps) {
	const src = `${url}/${imageData.id}`;
	return (
		<LazyLoadWrapper>
			<UIBasics.Box
				key={imageData.id}
				className={styles.galleryImageBox}
				withoutBorder
				withoutPadding
				withoutMargin={withoutMargin}>
				<Image
					onClick={
						clickAction
							? (event) =>
									clickAction({ event: event, url: src, imageData: imageData })
							: undefined
					}
					src={src}
					alt={imageData.fileName}
					fill
					sizes="100%"
					loading="lazy"
				/>
			</UIBasics.Box>
		</LazyLoadWrapper>
	);
}
