import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

interface SubmitButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	color?: "gray" | "green" | "red" | "teal" | "blue" | "violet" | "mauve";
}
export function SubmitButton({
	label,
	color = "green",
	className,
	...rest
}: SubmitButtonProps) {
	return (
		<button
			type="submit"
			className={clsx(styles.submitButton, color, className)}
			{...rest}>
			<label>{label}</label>
		</button>
	);
}
