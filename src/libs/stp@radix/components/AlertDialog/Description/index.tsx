import {
	AlertDialogDescription,
	AlertDialogDescriptionProps,
} from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface DescriptionProps extends AlertDialogDescriptionProps {
	width?: number;
	justForOrnament?: boolean;
}
export function Description({
	className,
	style,
	width,
	justForOrnament = false,
	...rest
}: DescriptionProps) {
	const descriptionsStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
		...(justForOrnament && {
			display: "none",
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
