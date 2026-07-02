"use client";

import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { CSSProperties, InputHTMLAttributes } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { LintIgnoredAny } from "@/libs/stp@types";

const BaseTextInputContainer = newStyledElement.div(
	styles.baseTextInputContainer,
);
const BaseTextInputField = newStyledElement.input(styles.baseTextInputField);
const BaseTextAreaInputField = newStyledElement.textarea(
	styles.baseTextAreaInputField,
);
const BaseTextInputLabel = newStyledElement.label(styles.baseTextInputLabel);
const BaseTextInputError = newStyledElement.div(styles.baseTextInputError);

export type BaseTextInputProps = {
	label?: string;
	labelBackground?: keyof typeof StandartBackgroundColor;
	errorMessage?: string;
	fontSize?:
		| "xxs"
		| "xs"
		| "sm"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "4xl"
		| "5xl"
		| "6xl"
		| "7xl"
		| "8xl"
		| "9xl";
	lesserPadding?: boolean;
	textCentered?: boolean;
	useTextArea?: boolean;
	// ref?: RefObject<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

export function BaseTextInput({
	label,
	labelBackground,
	errorMessage,
	fontSize,
	lesserPadding = false,
	textCentered = false,
	style,
	useTextArea,
	...rest
}: BaseTextInputProps) {
	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(textCentered && { textAlign: "center" }),
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
		...style,
	};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	return (
		<BaseTextInputContainer>
			<BaseTextInputLabel
				children={label}
				style={labelStyle}
			/>
			{errorMessage && <BaseTextInputError>{errorMessage}</BaseTextInputError>}
			{!useTextArea ? (
				<BaseTextInputField
					style={inputStyle}
					{...rest}
				/>
			) : (
				<BaseTextAreaInputField
					style={inputStyle}
					{...(rest as LintIgnoredAny)}
				/>
			)}
		</BaseTextInputContainer>
	);
}
