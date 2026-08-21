import {
	AlertDialogTitle,
	AlertDialogTitleProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface TitleProps extends AlertDialogTitleProps {
	width?: number;
	textAlign?: CSSProperties["textAlign"];
}
export function Title({
	className,
	style,
	width,
	textAlign,
	...rest
}: TitleProps) {
	const titleStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
		textAlign: textAlign,
		...style,
	};
	return (
		<AlertDialogTitle
			style={titleStyle}
			className={clsx(styles.alertDialogTitle, className)}
			{...rest}
		/>
	);
}
