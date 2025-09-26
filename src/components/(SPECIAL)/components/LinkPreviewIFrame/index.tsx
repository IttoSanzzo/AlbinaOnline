import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const LinkPreviewContainer = newStyledElement.div(styles.linkPreviewContainer);
const LinkPreviewLoadingScreenContainer = newStyledElement.div(
	styles.linkPreviewLoadingScreenContainer
);
const LinkPreviewLoadingScreenBanner = newStyledElement.span(
	styles.linkPreviewLoadingScreenBanner
);
const LinkPreviewLoadingScreenIcon = newStyledElement.span(
	styles.linkPreviewLoadingScreenIcon
);
const LinkPreviewLoadingScreenAnimation = newStyledElement.span(
	styles.linkPreviewLoadingScreenAnimation
);

export interface LinkPreviewIFrameProps {
	title?: string;
	href: string;
}
export function LinkPreviewIFrame({
	href,
	title = "Link",
}: LinkPreviewIFrameProps) {
	return (
		<LinkPreviewContainer>
			<LinkPreviewLoadingScreenContainer>
				<LinkPreviewLoadingScreenBanner />
				<LinkPreviewLoadingScreenIcon />
				<LinkPreviewLoadingScreenAnimation />
			</LinkPreviewLoadingScreenContainer>

			<iframe
				title={`${title} Preview`}
				name={`${title} Preview`}
				width={"574px"}
				height={"474px"}
				src={href}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				tabIndex={-1}
				loading="lazy"
			/>
		</LinkPreviewContainer>
	);
}
