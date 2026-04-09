import styles from "../../styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import GalleryCarousel from "../GalleryCarousel";

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
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutBorder
			withoutMargin={withoutMargin}
			classname={styles.galleryContainer}>
			<UIBasics.Box
				withoutMargin
				withoutPadding
				classname={styles.galleryInternalContainer}>
				<GalleryCarousel
					galleryData={galleryData}
					url={url}
				/>
			</UIBasics.Box>
		</UIBasics.Box>
	);
}
