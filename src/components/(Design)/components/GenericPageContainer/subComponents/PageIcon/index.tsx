import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ImageWithTTL } from "@/components/(UTILS)/components/ImageWithTTL";
import { ImageModal } from "../ImageModal";

const PageIconContainer = newStyledElement.div(styles.pageIconContainer);

interface PageIconProps {
	iconSrc: string;
	borderColor?: string;
	borderOpacity: number;
}
export function PageIcon({
	iconSrc,
	borderColor,
	borderOpacity,
}: PageIconProps) {
	return (
		<PageIconContainer>
			<ImageModal
				url={iconSrc}
				withTTL
			/>
			<ImageWithTTL
				src={iconSrc}
				alt="Page's icon"
				width={512}
				height={512}
				quality={100}
				preload
				style={
					borderColor
						? {
								backgroundColor: `${borderColor}${borderOpacity}`,
							}
						: undefined
				}
			/>
		</PageIconContainer>
	);
}
