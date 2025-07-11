import {
	AlertDialogTitle,
	AlertDialogTitleProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface TitleProps extends AlertDialogTitleProps {
	width?: number;
}
export function Title({ className, style, width, ...rest }: TitleProps) {
	const titleStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
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
