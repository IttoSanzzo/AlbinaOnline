import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { newStyledElement } from "@setsu-tp/styled-components";

const SubmitButtonTrigger = newStyledElement.button(styles.submitButtonTrigger);

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
		<SubmitButtonTrigger
			type="submit"
			className={clsx(color, className)}
			{...rest}>
			<label>{label}</label>
		</SubmitButtonTrigger>
	);
}
