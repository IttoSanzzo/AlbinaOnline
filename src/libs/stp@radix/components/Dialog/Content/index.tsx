import { DialogContent, DialogContentProps } from "@radix-ui/react-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface ContentProps extends DialogContentProps {
	width?: React.CSSProperties["width"];
	maxWidth?: React.CSSProperties["maxWidth"];
}
export function Content({ className, width, maxWidth, ...rest }: ContentProps) {
	const contentStyle: CSSProperties = {
		...(width && {
			width: width,
		}),
		...(maxWidth && {
			maxWidth: maxWidth,
		}),
	};
	return (
		<DialogContent
			style={contentStyle}
			className={clsx(styles.dialogContent, className)}
			{...rest}
		/>
	);
}
