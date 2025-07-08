import {
	DropdownMenuContent,
	DropdownMenuContentProps,
} from "@radix-ui/react-dropdown-menu";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";

interface ContentProps extends DropdownMenuContentProps {
	width?: number;
}
export function Content({ className, width, ...rest }: ContentProps) {
	const contentStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
	};
	return (
		<DropdownMenuContent
			style={contentStyle}
			className={clsx(styles.dropdownContent, className)}
			{...rest}
		/>
	);
}
