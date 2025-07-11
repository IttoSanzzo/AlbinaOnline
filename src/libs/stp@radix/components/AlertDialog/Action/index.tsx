import {
	AlertDialogAction,
	AlertDialogActionProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface ActionProps extends AlertDialogActionProps {
	width?: number;
	color?: "gray" | "green" | "red" | "teal" | "blue" | "violet" | "mauve";
}
export function Action({
	className,
	style,
	width,
	color = "red",
	...rest
}: ActionProps) {
	const actionStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
		...style,
	};
	return (
		<AlertDialogAction
			style={actionStyle}
			className={clsx(styles.alertDialogActionButton, color, className)}
			{...rest}
		/>
	);
}
