"use client";

import { Dialog } from "@/libs/stp@radix";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GalleryData } from "@/libs/stp@types";
import { GalleryImageActionFunction } from "../ImageBox";
import { AddImageButton, AddImageButtonHandle } from "../AddImageButton";
import { SortableGalleryImageGrid } from "./subComponents/SortableGalleryImageGrid";

interface GalleryFullViewModalProps {
	url: string;
	galleryData: GalleryData;
	setGalleryData: Dispatch<SetStateAction<GalleryData>>;
	openState: [boolean, Dispatch<SetStateAction<boolean>>];
	imageAction?: GalleryImageActionFunction;
	reloadGalleryData?: () => Promise<boolean>;
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
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const addButtonRef = useRef<AddImageButtonHandle | null>(null);

	useEffect(() => {
		if (openState[0] == true && galleryData.images.length == 0)
			openState[1](false);
	}, [galleryData, openState[1]]);

	if (galleryData.images.length == 0 || openState[0] == false) return null;
	return (
		<Dialog.Root
			open={openState[0]}
			onOpenChange={openState[1]}>
			<Dialog.Portal>
				<Dialog.Overlay>
					<Dialog.Content
						className={styles.modalContent}
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
						}}
						style={
							isEditable && isDragging
								? {
										outline:
											"5px solid color-mix(in srgb, var(--cl-blue-500) 50%, transparent)",
									}
								: undefined
						}>
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
								ref={addButtonRef}
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
