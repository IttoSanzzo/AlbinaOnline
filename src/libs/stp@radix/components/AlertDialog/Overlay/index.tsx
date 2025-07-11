import {
	AlertDialogOverlay,
	AlertDialogOverlayProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface OverlayProps extends AlertDialogOverlayProps {
	width?: number;
}
export function Overlay({ className, style, width, ...rest }: OverlayProps) {
	const overlayStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
		...style,
	};
	return (
		<AlertDialogOverlay
			style={overlayStyle}
			className={clsx(styles.alertDialogOverlay, className)}
			{...rest}
		/>
	);
}
