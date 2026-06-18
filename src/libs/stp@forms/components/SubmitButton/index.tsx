import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useHookedForm } from "../../context/HookedFormContext";
import { LintIgnoredAny } from "@/libs/stp@types";

const SubmitButtonTrigger = newStyledElement.button(styles.submitButtonTrigger);

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
	color?: "gray" | "green" | "red" | "teal" | "blue" | "violet" | "mauve";
	useDebugTitle?: boolean;
}
export function SubmitButton({
	label = "Submit",
	color = "green",
	className,
	disabled,
	useDebugTitle = false,
	...rest
}: SubmitButtonProps) {
	const {
		form: {
			formState: { isValid, isSubmitting, errors, isDirty },
		},
	} = useHookedForm();

	const errorsMap: Map<string, string> | undefined = !useDebugTitle
		? undefined
		: getErrorMessageFromErrorInstance(
				new Map(Object.entries(errors as unknown as LintIgnoredAny)),
			);
	const errorString =
		errorsMap == undefined
			? undefined
			: errorsMap.size == 0
				? undefined
				: errorsMap
						.entries()
						.map(([key, value]) => `${key}: ${value}`)
						.toArray()
						.join("\n");

	return (
		<SubmitButtonTrigger
			type="submit"
			title={errorString}
			className={clsx(color, className)}
			disabled={
				disabled == false
					? false
					: disabled || !isValid || isSubmitting || !isDirty
			}
			{...rest}>
			<label>{label}</label>
		</SubmitButtonTrigger>
	);
}

function getErrorMessageFromErrorInstance(
	map: Map<string, undefined>,
): Map<string, string> {
	try {
		const errorsMessages = new Map<string, string>();
		if (map.size == 0) return errorsMessages;
		for (const [name, value] of map.entries()) {
			if (Array.isArray(value)) {
				getErrorMessageFromErrorInstance(
					new Map((value as unknown as LintIgnoredAny).entries()),
				)
					.entries()
					.forEach(([childName, childError]) => {
						errorsMessages.set(`${name}.${childName}`, childError);
					});
			} else {
				if ((value as unknown as LintIgnoredAny)?.message != undefined)
					errorsMessages.set(
						name,
						(value as unknown as LintIgnoredAny)?.message ?? "ERROR",
					);
			}
		}
		return errorsMessages;
	} catch {
		return new Map<string, string>([
			["ERROR", "Error while transcribing errors."],
		]);
	}
}
