import {
	DropdownMenuContent,
	DropdownMenuContentProps,
} from "@radix-ui/react-dropdown-menu";
import styles from "./styles.module.css";
import clsx from "clsx";
import { CSSProperties } from "react";
import { Arrow } from "../Arrow";
import { newStyledElement } from "@setsu-tp/styled-components";

const Fallback = newStyledElement.div(styles.fallback);

interface ContentProps extends DropdownMenuContentProps {
	width?: number;
	fallbackMessage?: string;
}
export function Content({
	className,
	width,
	fallbackMessage = "Nenhuma opção disponível",
	children,
	...rest
}: ContentProps) {
	const contentStyle: CSSProperties = {
		...(width && {
			width: `${width}px`,
		}),
	};
	return (
		<DropdownMenuContent
			style={contentStyle}
			className={clsx(styles.dropdownContent, className)}
			{...rest}>
			<Arrow />
			<Fallback>{fallbackMessage}</Fallback>
			{children}
		</DropdownMenuContent>
	);
}
