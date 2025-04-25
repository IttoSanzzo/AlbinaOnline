import { SmartText } from "@/components/(UTILS)";
import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionPropsText,
	NotionTextColor,
} from "../../index";
import { NotionTextContainer } from "./styledElements";
import { CSSProperties } from "react";

interface NotionTextProps extends NotionPropsColor {
	children?: string;
	withBold?: boolean;
	withItalic?: boolean;
	withUnderline?: boolean;
	textAlign?: "left" | "center" | "right" | "flex-center";
}

export function NotionText({
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
		...(textAlign && textAlign === "flex-center"
			? { display: "flex", justifyContent: "center" }
			: { textAlign: textAlign }),
	};

	return (
		<NotionTextContainer style={style}>
			<SmartText content={children} />
		</NotionTextContainer>
	);
}
