import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useHookedForm } from "../../context/HookedFormContext";

const SubmitButtonTrigger = newStyledElement.button(styles.submitButtonTrigger);

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	color?: "gray" | "green" | "red" | "teal" | "blue" | "violet" | "mauve";
}
export function SubmitButton({
	label,
	color = "green",
	className,
	disabled,
	...rest
}: SubmitButtonProps) {
	const {
		form: {
			formState: { isValid, isSubmitting },
		},
	} = useHookedForm();
	return (
		<SubmitButtonTrigger
			type="submit"
			className={clsx(color, className)}
			disabled={
				disabled == false ? false : disabled || !isValid || isSubmitting
			}
			{...rest}>
			<label>{label}</label>
		</SubmitButtonTrigger>
	);
}
