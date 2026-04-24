"use client";

import { Dialog } from "@/libs/stp@radix";
import Image from "next/image";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction } from "react";
import { GalleryData } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { StpIcon } from "@/libs/stp@icons";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const LateralButtonsContainer = newStyledElement.div(
	styles.lateralButtonsContainer,
);
const LateralButton = newStyledElement.button(styles.lateralButton);
const ChangeImageButton = newStyledElement.button(styles.changeImageButton);

interface GalleryImageModalProps {
	url: string;
	galleryData: GalleryData;
	imageIndexState: [number, Dispatch<SetStateAction<number>>];
	openState: [boolean, Dispatch<SetStateAction<boolean>>];
	reloadGalleryData?: () => Promise<void>;
	moveImageCarousel?: (index: number) => void;
}
export function GalleryImageModal({
	url,
	galleryData,
	imageIndexState,
	openState,
	reloadGalleryData,
	moveImageCarousel,
}: GalleryImageModalProps) {
	if (galleryData.images.length == 0 || openState[0] == false) return null;
	const activeImageData = galleryData.images[imageIndexState[0]];

	function moveToPreviousImage() {
		let newIndex = imageIndexState[0] - 1;
		if (newIndex < 0) newIndex = galleryData.images.length - 1;
		imageIndexState[1](newIndex);
		if (moveImageCarousel) moveImageCarousel(newIndex);
	}
	function moveToNextImage() {
		let newIndex = imageIndexState[0] + 1;
		if (newIndex > galleryData.images.length - 1) newIndex = 0;
		imageIndexState[1](newIndex);
		if (moveImageCarousel) moveImageCarousel(newIndex);
	}
	async function downloadImage() {
		const response = await authenticatedFetchAsync(
			`${url}/${activeImageData.id}`,
			{ method: "GET" },
		);
		const blob = await response.blob();

		const imageUrl = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = imageUrl;
		link.download = activeImageData.fileName;

		document.body.appendChild(link);
		link.click();
		link.remove();

		window.URL.revokeObjectURL(url);
	}
	async function deleteImage() {
		if (!reloadGalleryData) return;
		const response = await authenticatedFetchAsync(
			`${url}/${activeImageData.id}`,
			{ method: "DELETE" },
		);
		if (!response.ok) return;
		if (imageIndexState[0] == galleryData.images.length - 1) {
			imageIndexState[1](0);
			if (moveImageCarousel) moveImageCarousel(0);
		}
		if (galleryData.images.length == 1) openState[1](false);
		await revalidateTagByClientSide(url);
		await reloadGalleryData();
	}

	return (
		<Dialog.Root
			open={openState[0]}
			onOpenChange={openState[1]}>
			<Dialog.Portal>
				<Dialog.Overlay>
					<Dialog.Content
						className={styles.modalContent}
						onKeyDownCapture={async (event) => {
							event.preventDefault();
							switch (event.key) {
								case "ArrowLeft":
								case "A":
								case "a":
									moveToPreviousImage();
									break;
								case "ArrowRight":
								case "D":
								case "d":
									moveToNextImage();
									break;
								case "ArrowDown":
								case "S":
								case "s":
									downloadImage();
									break;
								case "Delete":
									deleteImage();
									break;
							}
						}}>
						<Dialog.Title />
						<Dialog.Description />
						<Image
							src={`${url}/${activeImageData.id}`}
							alt={activeImageData.fileName}
							fill
							sizes="100%"
							loading="lazy"
						/>
						{galleryData.images.length > 1 && (
							<>
								<ChangeImageButton
									className={styles.previousImage}
									onClick={() => moveToPreviousImage()}>
									<StpIcon
										name="ArrowLeft"
										style="regular"
									/>
								</ChangeImageButton>
								<ChangeImageButton
									className={styles.nextImage}
									onClick={() => moveToNextImage()}>
									<StpIcon
										name="ArrowRight"
										style="regular"
									/>
								</ChangeImageButton>
							</>
						)}

						<LateralButtonsContainer>
							<LateralButton onClick={async () => downloadImage()}>
								<StpIcon
									name="DownloadSimple"
									style="regular"
								/>
							</LateralButton>
							{reloadGalleryData && (
								<LateralButton onClick={async () => deleteImage()}>
									<StpIcon
										name="Trash"
										style="regular"
									/>
								</LateralButton>
							)}
						</LateralButtonsContainer>
					</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
