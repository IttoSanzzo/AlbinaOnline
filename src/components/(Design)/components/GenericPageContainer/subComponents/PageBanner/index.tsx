import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";

const PageBannerContainer = newStyledElement.div(styles.pageBannerContainer);

interface PageBannerProps {
	bannerSrc: string;
}
export function PageBanner({ bannerSrc }: PageBannerProps) {
	return (
		<PageBannerContainer>
			<ImageWithTTL
				src={bannerSrc}
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
