import { DialogOverlay, DialogOverlayProps } from "@radix-ui/react-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface OverlayProps extends DialogOverlayProps {
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
		<DialogOverlay
			style={overlayStyle}
			className={clsx(styles.dialogOverlay, className)}
			{...rest}
		/>
	);
}
