import Image, { StaticImageData } from "next/image";
import { PageBannerContainer } from "./styledElements";

interface PageBannerProps {
	src: string | StaticImageData;
}

export default function PageBanner({ src }: PageBannerProps) {
	return (
		<PageBannerContainer>
			<Image
				src={src}
				alt="Page's banner"
			/>
		</PageBannerContainer>
	);
}
