import { NotionPropsColor, NotionTextColor } from "@/utils/NotionBasedUtils";
import {
	BeforeBar,
	ContentContainer,
	NotionQuoteContainer,
} from "./styledElements";
import { CSSProperties, ReactNode } from "react";

interface NotionQuoteProps extends NotionPropsColor {
	children: ReactNode;
}

export default function NotionQuote({
	children,
	textColor,
	backgroundColor,
}: NotionQuoteProps) {
	const style: CSSProperties = {
		...(textColor && { color: textColor }),
		...(backgroundColor && { backgroundColor: backgroundColor }),
	};

	return (
		<NotionQuoteContainer style={style}>
			<BeforeBar
				style={{
					backgroundColor: textColor ? textColor : NotionTextColor.Default,
				}}
			/>
			<ContentContainer>{children}</ContentContainer>
		</NotionQuoteContainer>
	);
}
