"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { GalleryImageData } from "@/libs/stp@types";
import Image from "next/image";
import styles from "./styles.module.css";
import { useState } from "react";
import { Dialog } from "@/libs/stp@radix";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon } from "@/libs/stp@icons";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const LateralButtonsContainer = newStyledElement.div(
	styles.lateralButtonsContainer,
);
const LateralButton = newStyledElement.button(styles.lateralButton);

interface ImageBoxProps {
	url: string;
	imageData: GalleryImageData;
	reloadGalleryData?: () => Promise<void>;
}
export default function ImageBox({
	url,
	imageData,
	reloadGalleryData,
}: ImageBoxProps) {
	const [openState, setOpenState] = useState<boolean>(false);

	return (
		<UIBasics.Box
			key={imageData.id}
			classname={styles.galleryImageBox}
			withoutBorder
			withoutPadding>
			<Image
				onClick={() => {
					setOpenState(true);
				}}
				src={`${url}/${imageData.id}`}
				alt={imageData.fileName}
				fill
				loading="eager"
			/>
			<Dialog.Root
				open={openState}
				onOpenChange={setOpenState}>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content className={styles.modalContent}>
							<Dialog.Title />
							<Dialog.Description />
							<Image
								src={`${url}/${imageData.id}`}
								alt={imageData.fileName}
								fill
								loading="eager"
							/>
							<LateralButtonsContainer>
								<LateralButton
									onClick={async () => {
										const response = await authenticatedFetchAsync(
											`${url}/${imageData.id}`,
											{ method: "DELETE" },
										);
										const blob = await response.blob();

										const imageUrl = window.URL.createObjectURL(blob);
										const link = document.createElement("a");
										link.href = imageUrl;
										link.download = imageData.fileName;

										document.body.appendChild(link);
										link.click();
										link.remove();

										window.URL.revokeObjectURL(url);
									}}>
									<StpIcon
										name="DownloadSimple"
										style="regular"
									/>
								</LateralButton>
								{reloadGalleryData && (
									<LateralButton
										onClick={async () => {
											const response = await authenticatedFetchAsync(
												`${url}/${imageData.id}`,
												{ method: "DELETE" },
											);
											if (!response.ok) return;
											await revalidateTagByClientSide(url);
											setOpenState(false);
											await reloadGalleryData();
										}}>
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
		</UIBasics.Box>
	);
}
