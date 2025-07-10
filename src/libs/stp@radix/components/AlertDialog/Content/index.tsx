import {
	AlertDialogContent,
	AlertDialogContentProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface ContentProps extends AlertDialogContentProps {
	width?: number;
}
export function Content({ className, width, ...rest }: ContentProps) {
	const contentStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
	};
	return (
		<AlertDialogContent
			style={contentStyle}
			className={clsx(styles.dialogContent, className)}
			{...rest}
		/>
	);
}
