import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionPropsText,
	NotionTextColor,
} from "@/utils/NotionBasedUtils";
import { NotionTextContainer } from "./styledElements";
import { CSSProperties, ReactNode } from "react";

interface NotionTextProps extends NotionPropsColor, NotionPropsText {
	children: ReactNode;
}

export default function NotionText({
	children,
	textColor,
	backgroundColor,
	withBold,
	withItalic,
	withUnderline,
	textAlign,
}: NotionTextProps) {
	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
		...(withBold && { fontWeight: "bold" }),
		...(withItalic && { fontStyle: "italic" }),
		...(withUnderline && { textDecoration: "underline" }),
		...(textAlign && { textAlign: textAlign }),
	};

	return <NotionTextContainer style={style}>{children}</NotionTextContainer>;
}
