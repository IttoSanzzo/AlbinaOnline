import Image, { StaticImageData } from "next/image";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const PageBannerContainer = newStyledElement.div(styles.pageBannerContainer);

interface PageBannerProps {
	bannerSrc: string | StaticImageData;
}
export function PageBanner({ bannerSrc }: PageBannerProps) {
	return (
		<PageBannerContainer>
			<Image
				src={bannerSrc}
				alt="Page's banner"
				priority={true}
				sizes="(max-width: 100%)"
				fill={true}
				quality={100}
			/>
		</PageBannerContainer>
	);
}
