import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartColorProps } from "../../core";
import {
	SmartText,
	StandartBackgroundColorKeyToProperty,
	StandartTextColorKeyToProperty,
} from "../../utils";

const TextContainer = newStyledElement.div(styles.textContainer);

interface TextProps extends StandartColorProps {
	children?: string;
	withBold?: boolean;
	withItalic?: boolean;
	withUnderline?: boolean;
	textAlign?: "left" | "center" | "right" | "flex-center";
	display?: CSSProperties["display"];
	whiteSpace?: CSSProperties["whiteSpace"];
	id?: string;
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
	whiteSpace,
	id,
}: TextProps) {
	const style: CSSProperties = {
		color: StandartTextColorKeyToProperty(textColor),
		backgroundColor: StandartBackgroundColorKeyToProperty(backgroundColor),
		whiteSpace: whiteSpace,
		...(withBold && { fontWeight: "bold" }),
		...(withItalic && { fontStyle: "italic" }),
		...(withUnderline && { textDecoration: "underline" }),
		...(textAlign && textAlign === "flex-center"
			? { display: "flex", justifyContent: "center" }
			: { textAlign: textAlign }),
		display: display,
	};

	return (
		<TextContainer
			style={style}
			id={id}>
			<SmartText content={children} />
		</TextContainer>
	);
}
