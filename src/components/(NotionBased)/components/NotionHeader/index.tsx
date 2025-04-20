import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionPropsText,
	NotionTextColor,
} from "../../index";
import { CSSProperties, ReactNode } from "react";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";

interface NotionHeaderProps extends NotionPropsColor, NotionPropsText {
	children: ReactNode | string;
	headerType?: "h1" | "h2" | "h3" | "h4" | "h5";
}

export function NotionHeader({
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
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
		...(withBold && { fontWeight: "bold" }),
		...(withItalic && { fontStyle: "italic" }),
		...(withUnderline && { textDecoration: "underline" }),
		...(textAlign && { textAlign: textAlign }),
	};
	const HeaderElement = newStyledElement[headerType](
		styles.notionHeaderContainer
	);

	return (
		<HeaderElement
			id={typeof children === "string" ? children : undefined}
			style={style}>
			{children}
		</HeaderElement>
	);
}
