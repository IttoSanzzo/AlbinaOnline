import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "../../index";
import {
	BeforeBar,
	ContentContainer,
	NotionQuoteContainer,
} from "./styledElements";
import { CSSProperties, ReactNode } from "react";

interface NotionQuoteProps extends NotionPropsColor {
	children?: ReactNode;
}

export function NotionQuote({
	children,
	textColor,
	backgroundColor,
}: NotionQuoteProps) {
	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};

	return (
		<NotionQuoteContainer style={style}>
			<BeforeBar
				style={{
					backgroundColor: textColor
						? NotionTextColor[textColor]
						: NotionTextColor.default,
				}}
			/>
			<ContentContainer>{children}</ContentContainer>
		</NotionQuoteContainer>
	);
}
