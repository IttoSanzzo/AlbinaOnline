import { GalleryData, GalleryImageData } from "@/libs/stp@types";
import ImageBox, { GalleryImageActionFunction } from "../../../ImageBox";
import { UIBasics } from "@/components/(UIBasics)";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableGalleryImageBox } from "./subComponents/DraggableGalleryImageBox";
import { Dispatch, SetStateAction } from "react";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

export const ImageContainer = newStyledElement.div(styles.imageContainer);

function getNewImageDataArray(
	images: GalleryImageData[],
	oldIndex: number,
	newIndex: number,
): GalleryImageData[] {
	const imageToMove = images[oldIndex];
	const imagesWithoutImageToMove = images.filter(
		(_, index) => index != oldIndex,
	);
	return [
		...imagesWithoutImageToMove.slice(0, newIndex),
		imageToMove,
		...imagesWithoutImageToMove.slice(newIndex),
	];
}

async function postReorderAsync(
	url: string,
	imageId: string,
	newPosition: number,
): Promise<boolean> {
	const response = await authenticatedFetchAsync(`${url}/reorder`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			id: imageId,
			newPosition: newPosition,
		}),
	});
	return response.ok;
}

interface SortableGalleryImageGridProps {
	url: string;
	galleryData: GalleryData;
	setGalleryData: Dispatch<SetStateAction<GalleryData>>;
	imageAction?: GalleryImageActionFunction;
	isEditable?: boolean;
}
export function SortableGalleryImageGrid({
	galleryData,
	url,
	imageAction,
	isEditable,
	setGalleryData,
}: SortableGalleryImageGridProps) {
	if (!isEditable)
		return (
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
		);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = galleryData.images.findIndex(
			(imageData) => imageData.id == active.id,
		);
		const newIndex = galleryData.images.findIndex(
			(imageData) => imageData.id == over.id,
		);

		setGalleryData({
			updatedAt: galleryData.updatedAt,
			images: getNewImageDataArray(galleryData.images, oldIndex, newIndex),
		});
		await postReorderAsync(url, galleryData.images[oldIndex].id, newIndex + 1);
		await revalidateTagByClientSide(url);
	}

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}>
			<SortableContext
				items={galleryData.images.map((imageData) => imageData.id)}
				strategy={rectSortingStrategy}>
				<UIBasics.List.Grid
					style={{ height: "100%", overflowY: "scroll" }}
					direction="row"
					children={galleryData.images.map((imageData) => (
						<SortableGalleryImageBox
							key={imageData.id}
							imageBoxProps={{
								url: url,
								imageData: imageData,
								clickAction: imageAction,
								withoutMargin: true,
							}}
						/>
					))}
				/>
			</SortableContext>
		</DndContext>
	);
}
