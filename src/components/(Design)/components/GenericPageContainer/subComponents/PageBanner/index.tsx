import Image, { StaticImageData } from "next/image";
import { PageBannerContainer } from "./styledElements";

interface PageBannerProps {
	src: string | StaticImageData;
}

export function PageBanner({ src }: PageBannerProps) {
	return (
		<PageBannerContainer>
			<Image
				src={src}
				alt="Page's banner"
				width={1720}
				height={260}
				priority={true}
			/>
		</PageBannerContainer>
	);
}
