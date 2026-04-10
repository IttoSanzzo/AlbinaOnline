import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import ImageBox, { ImageBoxProps } from "../../../../../ImageBox";
import { ImageContainer } from "../..";
import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableGalleryImageBoxContainer = newStyledElement.div(
	styles.sortableGalleryImageBoxContainer,
);
const DragButton = newStyledElement.button(styles.dragButton);

interface SortableGalleryImageBoxProps {
	imageBoxProps: ImageBoxProps;
}
export function SortableGalleryImageBox({
	imageBoxProps,
}: SortableGalleryImageBoxProps) {
	const stableIdRef = useRef(imageBoxProps.imageData.id ?? crypto.randomUUID());
	const id = stableIdRef.current;

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<SortableGalleryImageBoxContainer
			ref={setNodeRef}
			style={style}
			{...attributes}>
			<ImageContainer>
				<ImageBox {...imageBoxProps} />
			</ImageContainer>
			<DragButton {...listeners}>☰</DragButton>
		</SortableGalleryImageBoxContainer>
	);
}
