import { SmartText } from "@/components/(UTILS)";
import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionPropsText,
	NotionTextColor,
} from "../../index";
import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const NotionTextContainer = newStyledElement.div(
	styles.notionTextContainer
);

interface NotionTextProps extends NotionPropsColor {
	children?: string;
	withBold?: boolean;
	withItalic?: boolean;
	withUnderline?: boolean;
	textAlign?: "left" | "center" | "right" | "flex-center";
	display?: "inline" | "block";
}

export function NotionText({
	children,
	textColor,
	backgroundColor,
	withBold,
	withItalic,
	withUnderline,
	textAlign,
	display,
}: NotionTextProps) {
	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
		...(withBold && { fontWeight: "bold" }),
		...(withItalic && { fontStyle: "italic" }),
		...(withUnderline && { textDecoration: "underline" }),
		...(textAlign && textAlign === "flex-center"
			? { display: "flex", justifyContent: "center" }
			: { textAlign: textAlign }),
		...(display && { display: display }),
	};

	return (
		<NotionTextContainer style={style}>
			<SmartText content={children} />
		</NotionTextContainer>
	);
}
