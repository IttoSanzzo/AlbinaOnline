import styles from "../../styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { GalleryData } from "@/libs/stp@types";
import GalleryCarousel from "../GalleryCarousel";

interface StaticGalleryProps {
	url: string;
}
export default async function StaticGallery({ url }: StaticGalleryProps) {
	const response = await fetch(url, {
		method: "GET",
		next: {
			tags: [url],
		},
	});
	const galleryData: GalleryData = response.ok
		? await response.json()
		: { images: [], updatedAt: "" };

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutBorder
			withoutMargin
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
