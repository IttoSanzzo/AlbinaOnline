import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import {
	StandartBackgroundColor,
	StandartColorProps,
	StandartTextColor,
} from "../../core";
import {
	SmartText,
	StandartBackgroundColorKeyToProperty,
	StandartTextColorKeyToProperty,
} from "../../utils";

export const TextContainer = newStyledElement.div(styles.textContainer);

interface TextProps extends StandartColorProps {
	children?: string;
	withBold?: boolean;
	withItalic?: boolean;
	withUnderline?: boolean;
	textAlign?: "left" | "center" | "right" | "flex-center";
	display?: CSSProperties["display"];
}
export function Text({
	children,
	textColor,
	backgroundColor,
	withBold,
	withItalic,
	withUnderline,
	textAlign,
	display,
}: TextProps) {
	const style: CSSProperties = {
		color: StandartTextColorKeyToProperty(textColor),
		backgroundColor: StandartBackgroundColorKeyToProperty(backgroundColor),
		...(withBold && { fontWeight: "bold" }),
		...(withItalic && { fontStyle: "italic" }),
		...(withUnderline && { textDecoration: "underline" }),
		...(textAlign && textAlign === "flex-center"
			? { display: "flex", justifyContent: "center" }
			: { textAlign: textAlign }),
		display: display,
	};

	return (
		<TextContainer style={style}>
			<SmartText content={children} />
		</TextContainer>
	);
}
