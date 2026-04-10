import { GalleryData } from "@/libs/stp@types";
import { GalleryCore } from "../subComponents/GalleryCore";

interface StaticGalleryProps {
	url: string;
	hideIfEmpty?: boolean;
	withoutMargin?: boolean;
}
export default async function StaticGallery({
	url,
	hideIfEmpty,
	withoutMargin = false,
}: StaticGalleryProps) {
	const response = await fetch(url, {
		method: "GET",
		next: {
			tags: [url],
		},
	});
	const galleryData: GalleryData = response.ok
		? await response.json()
		: { images: [], updatedAt: "" };

	if (hideIfEmpty && galleryData.images.length == 0) return null;
	return (
		<GalleryCore
			url={url}
			isEditable={false}
			withoutMargin={withoutMargin}
			galleryData={galleryData}
		/>
	);
}
