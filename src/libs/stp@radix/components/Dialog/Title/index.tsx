import { DialogTitle, DialogTitleProps } from "@radix-ui/react-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import React, { CSSProperties } from "react";

interface TitleProps extends DialogTitleProps {
	width?: React.CSSProperties["width"];
	marginBottom?: React.CSSProperties["marginBottom"];
	textAlign?: React.CSSProperties["textAlign"];
}
export function Title({
	className,
	style,
	width,
	marginBottom,
	textAlign,
	...rest
}: TitleProps) {
	const titleStyle: CSSProperties = {
		width: width,
		marginBottom: marginBottom,
		textAlign: textAlign,
		...style,
	};
	return (
		<DialogTitle
			style={titleStyle}
			className={clsx(styles.dialogTitle, className)}
			{...rest}
		/>
	);
}
