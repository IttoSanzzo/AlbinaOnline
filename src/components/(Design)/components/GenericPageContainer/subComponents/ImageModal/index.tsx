"use client";

import { Dialog } from "@/libs/stp@radix";
import Image from "next/image";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { StpIcon } from "@/libs/stp@icons";
import { useEffect, useRef, useState } from "react";

const LateralButtonsContainer = newStyledElement.div(
	styles.lateralButtonsContainer,
);
const LateralButton = newStyledElement.button(styles.lateralButton);

interface ImageModalProps {
	url: string;
}
export function ImageModal({ url }: ImageModalProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const imageModalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (imageModalRef.current && imageModalRef.current.parentElement) {
			imageModalRef.current.parentElement.onclick = () => {
				setIsOpen(true);
			};
		}
	}, [imageModalRef]);

	async function downloadImage() {
		const response = await authenticatedFetchAsync(url, { method: "GET" });
		const blob = await response.blob();

		const imageUrl = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = imageUrl;
		link.download = url;

		document.body.appendChild(link);
		link.click();
		link.remove();

		window.URL.revokeObjectURL(url);
	}

	return (
		<div
			style={{ display: "none" }}
			ref={imageModalRef}>
			<Dialog.Root
				open={isOpen}
				onOpenChange={setIsOpen}>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content className={styles.modalContent}>
							<Dialog.Title />
							<Dialog.Description />
							<Image
								src={url}
								alt={url}
								fill
								sizes="100%"
								loading="lazy"
							/>
							<LateralButtonsContainer>
								<LateralButton onClick={async () => downloadImage()}>
									<StpIcon
										name="DownloadSimple"
										style="regular"
									/>
								</LateralButton>
							</LateralButtonsContainer>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}
