export type GalleryImageData = {
	id: string;
	createdAt: string;
	fileExtension: string;
	fileName: string;
};

export type GalleryData = {
	updatedAt: string;
	images: GalleryImageData[];
};
