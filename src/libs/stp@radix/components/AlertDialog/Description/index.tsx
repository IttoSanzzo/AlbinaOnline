import {
	AlertDialogDescription,
	AlertDialogDescriptionProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface DescriptionProps extends AlertDialogDescriptionProps {
	width?: number;
}
export function Description({
	className,
	style,
	width,
	...rest
}: DescriptionProps) {
	const descriptionsStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
		...style,
	};
	return (
		<AlertDialogDescription
			style={descriptionsStyle}
			className={clsx(styles.alertDialogDescription, className)}
			{...rest}
		/>
	);
}
