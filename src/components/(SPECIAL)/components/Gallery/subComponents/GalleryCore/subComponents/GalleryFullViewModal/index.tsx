"use client";

import { Dialog } from "@/libs/stp@radix";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction } from "react";
import { GalleryData } from "@/libs/stp@types";
import ImageBox, { GalleryImageActionFunction } from "../ImageBox";
import { UIBasics } from "@/components/(UIBasics)";
import AddImageButton from "../AddImageButton";

const ImageContainer = newStyledElement.div(styles.imageContainer);

interface GalleryFullViewModalProps {
	url: string;
	galleryData: GalleryData;
	openState: [boolean, Dispatch<SetStateAction<boolean>>];
	imageAction?: GalleryImageActionFunction;
	reloadGalleryData?: () => Promise<void>;
	isEditable?: boolean;
}
export function GalleryFullViewModal({
	url,
	galleryData,
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
						<UIBasics.List.Grid
							style={{ height: "100%", overflowY: "scroll" }}
							direction="row"
							children={galleryData.images.map((imageData) => (
								<ImageContainer key={imageData.id}>
									<ImageBox
										url={url}
										imageData={imageData}
										clickAction={imageAction}
										withoutMargin
									/>
								</ImageContainer>
							))}
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
