"use client";

import { Dialog } from "@/libs/stp@radix";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction } from "react";
import { GalleryData } from "@/libs/stp@types";
import { GalleryImageActionFunction } from "../ImageBox";
import AddImageButton from "../AddImageButton";
import { SortableGalleryImageGrid } from "./subComponents/SortableGalleryImageGrid";

interface GalleryFullViewModalProps {
	url: string;
	galleryData: GalleryData;
	setGalleryData: Dispatch<SetStateAction<GalleryData>>;
	openState: [boolean, Dispatch<SetStateAction<boolean>>];
	imageAction?: GalleryImageActionFunction;
	reloadGalleryData?: () => Promise<void>;
	isEditable?: boolean;
}
export function GalleryFullViewModal({
	url,
	galleryData,
	setGalleryData,
	openState,
	imageAction,
	reloadGalleryData,
	isEditable,
}: GalleryFullViewModalProps) {
	if (galleryData.images.length == 0 || openState[0] == false) return null;
	return (
		<Dialog.Root
			open={openState[0]}
			onOpenChange={openState[1]}>
			<Dialog.Portal>
				<Dialog.Overlay>
					<Dialog.Content className={styles.modalContent}>
						<Dialog.Title />
						<Dialog.Description />
						<SortableGalleryImageGrid
							galleryData={galleryData}
							setGalleryData={setGalleryData}
							url={url}
							imageAction={imageAction}
							isEditable={isEditable}
						/>
						{isEditable && (
							<AddImageButton
								url={url}
								reloadGalleryData={reloadGalleryData}
								withoutMargin
							/>
						)}
					</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
