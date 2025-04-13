import { NotionPropsColor, NotionPropsText } from "@/utils/NotionBasedUtils";
import { CSSProperties, ReactNode } from "react";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";

interface NotionHeaderProps extends NotionPropsColor, NotionPropsText {
	children: ReactNode;
	headerType?: "h1" | "h2" | "h3";
}

export default function NotionHeader({
	headerType = "h1",
	children,
	textColor,
	backgroundColor,
	withBold,
	withItalic,
	withUnderline,
	textAlign,
}: NotionHeaderProps) {
	const style: CSSProperties = {
		...(textColor && { color: textColor }),
		...(backgroundColor && { backgroundColor: backgroundColor }),
		...(withBold && { fontWeight: "bold" }),
		...(withItalic && { fontStyle: "italic" }),
		...(withUnderline && { textDecoration: "underline" }),
		...(textAlign && { textAlign: textAlign }),
	};
	const HeaderElement = newStyledElement[headerType](
		styles.notionHeaderContainer
	);

	return <HeaderElement style={style}>{children}</HeaderElement>;
}
