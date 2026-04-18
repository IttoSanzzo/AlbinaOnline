import Image from "next/image";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { imageSrcTTL } from "@/utils/Cache";

const PageBannerContainer = newStyledElement.div(styles.pageBannerContainer);

interface PageBannerProps {
	bannerSrc: string;
}
export function PageBanner({ bannerSrc }: PageBannerProps) {
	return (
		<PageBannerContainer>
			<Image
				src={imageSrcTTL(bannerSrc)}
				alt="Page's banner"
				priority={true}
				sizes="100vw"
				fill={true}
				quality={90}
				preload
			/>
		</PageBannerContainer>
	);
}
