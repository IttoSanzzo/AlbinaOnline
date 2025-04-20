import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionText,
	NotionTextColor,
} from "../../index";
import {
	BeforeBar,
	ContentContainer,
	NotionQuoteContainer,
} from "./styledElements";
import { CSSProperties, ReactNode } from "react";

interface NotionQuoteProps extends NotionPropsColor {
	children?: ReactNode | string;
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
			<ContentContainer>
				{typeof children === "string" ? (
					<NotionText>{children}</NotionText>
				) : (
					children
				)}
			</ContentContainer>
		</NotionQuoteContainer>
	);
}
