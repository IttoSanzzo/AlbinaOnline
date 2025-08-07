import { CSSProperties, ReactNode } from "react";
import {
	NotionBackgroundColor,
	NotionTextColor,
} from "../../core/NotionBasedCore";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const NotionBoxContainer = newStyledElement.div(
	styles.notionBoxContainer
);

interface NotionBoxProps {
	children?: ReactNode;
	withoutPadding?: boolean;
	withoutBorder?: boolean;
	withoutMargin?: boolean;
	backgroundColor?: keyof typeof NotionBackgroundColor;
	width?: React.CSSProperties["width"];
	height?: React.CSSProperties["height"];
	minWidth?: React.CSSProperties["minWidth"];
	minHeight?: React.CSSProperties["minHeight"];
}

export function NotionBox({
	children,
	withoutPadding = false,
	withoutBorder = false,
	withoutMargin = false,
	backgroundColor,
	width,
	height,
	minHeight,
	minWidth,
}: NotionBoxProps) {
	const style: CSSProperties = {
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
			borderColor: `${NotionTextColor[backgroundColor]}15`,
		}),
		...(withoutBorder && {
			border: "0",
		}),
		...(withoutPadding && { padding: "0" }),
		...(withoutMargin && { margin: "0" }),
		width,
		height,
		minWidth,
		minHeight,
	};

	return <NotionBoxContainer style={style}>{children}</NotionBoxContainer>;
}
