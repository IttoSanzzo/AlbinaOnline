import { DialogContent, DialogContentProps } from "@radix-ui/react-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface ContentProps extends DialogContentProps {
	width?: number;
}
export function Content({ className, width, ...rest }: ContentProps) {
	const contentStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
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
