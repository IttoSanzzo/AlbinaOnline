import { CSSProperties, forwardRef, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor, StandartTextColor } from "../../core";

const BoxContainer = newStyledElement.div(styles.boxContainer);

interface BoxProps {
	children?: ReactNode;
	withoutPadding?: boolean;
	withoutBorder?: boolean;
	withoutMargin?: boolean;
	withoutBorderRadius?: boolean;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	width?: React.CSSProperties["width"];
	height?: React.CSSProperties["height"];
	minWidth?: React.CSSProperties["minWidth"];
	minHeight?: React.CSSProperties["minHeight"];
	flexDirection?: React.CSSProperties["flexDirection"];
	justifyContent?: React.CSSProperties["justifyContent"];
	classname?: string;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
	{
		children,
		withoutPadding = false,
		withoutBorder = false,
		withoutMargin = false,
		withoutBorderRadius = false,
		backgroundColor,
		width,
		height,
		minHeight,
		minWidth,
		flexDirection,
		justifyContent,
		classname,
	}: BoxProps,
	ref,
) {
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
		...(withoutBorderRadius && { borderRadius: 0 }),
		width,
		height,
		minWidth,
		minHeight,
		flexDirection,
		justifyContent,
	};

	return (
		<BoxContainer
			ref={ref}
			style={style}
			className={classname}>
			{children}
		</BoxContainer>
	);
});
