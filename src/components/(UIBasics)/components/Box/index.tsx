import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor, StandartTextColor } from "../../core";

const BoxContainer = newStyledElement.div(styles.boxContainer);

interface BoxProps {
	children?: ReactNode;
	withoutPadding?: boolean;
	withoutBorder?: boolean;
	withoutMargin?: boolean;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	width?: React.CSSProperties["width"];
	height?: React.CSSProperties["height"];
	minWidth?: React.CSSProperties["minWidth"];
	minHeight?: React.CSSProperties["minHeight"];
	flexDirection?: React.CSSProperties["flexDirection"];
	justifyContent?: React.CSSProperties["justifyContent"];
}

export function Box({
	children,
	withoutPadding = false,
	withoutBorder = false,
	withoutMargin = false,
	backgroundColor,
	width,
	height,
	minHeight,
	minWidth,
	flexDirection,
	justifyContent,
}: BoxProps) {
	const style: CSSProperties = {
		...(backgroundColor && {
			backgroundColor: StandartBackgroundColor[backgroundColor],
			borderColor: `${StandartTextColor[backgroundColor]}15`,
		}),
		...(withoutPadding && { padding: 0 }),
		...(withoutMargin && { margin: 0 }),
		...(withoutBorder && {
			border: 0,
		}),
		width,
		height,
		minWidth,
		minHeight,
		flexDirection,
		justifyContent,
	};

	return <BoxContainer style={style}>{children}</BoxContainer>;
}
