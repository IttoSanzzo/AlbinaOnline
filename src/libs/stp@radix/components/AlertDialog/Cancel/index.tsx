import {
	AlertDialogCancel,
	AlertDialogCancelProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface CancelProps extends AlertDialogCancelProps {
	width?: number;
	color?: "gray" | "green" | "red" | "teal" | "blue" | "violet" | "mauve";
}
export function Cancel({
	className,
	style,
	width,
	color = "gray",
	...rest
}: CancelProps) {
	const cancelStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
		...style,
	};
	return (
		<AlertDialogCancel
			style={cancelStyle}
			className={clsx(styles.alertDialogCancelButton, color, className)}
			{...rest}
		/>
	);
}
