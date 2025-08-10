import { CSSProperties, ReactNode } from "react";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { idfyString } from "@/utils/StringUtils";
import { StandartColorProps, StandartTextProps } from "../../core";
import {
	StandartBackgroundColorKeyToProperty,
	StandartTextColorKeyToProperty,
} from "../..";

interface HeaderProps extends StandartColorProps, StandartTextProps {
	children: ReactNode | string;
	headerType?: "h1" | "h2" | "h3" | "h4" | "h5";
}

export function Header({
	headerType = "h1",
	children,
	textColor,
	backgroundColor,
	withBold,
	withItalic,
	withUnderline,
	textAlign,
}: HeaderProps) {
	const style: CSSProperties = {
		color: StandartTextColorKeyToProperty(textColor),
		backgroundColor: StandartBackgroundColorKeyToProperty(backgroundColor),
		...(withBold && { fontWeight: "bold" }),
		...(withItalic && { fontStyle: "italic" }),
		...(withUnderline && { textDecoration: "underline" }),
		...(textAlign && { textAlign: textAlign }),
	};
	const HeaderElement = newStyledElement[headerType](styles.headerContainer);

	return (
		<HeaderElement
			id={typeof children === "string" ? idfyString(children) : undefined}
			style={style}
			children={children}
		/>
	);
}
