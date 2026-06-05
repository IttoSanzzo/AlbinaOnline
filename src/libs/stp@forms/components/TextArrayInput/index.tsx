"use client";

import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { CSSProperties, InputHTMLAttributes } from "react";
import { FieldValues, Path } from "react-hook-form";
import { ObjectArrayInput } from "../ObjectArrayInput";
import { ObjectArrayTextInput } from "../ObjectArrayTextInput";
import styles from "./styles.module.css";

type TextArrayInputProps<TFormInput> = {
	fieldName: Path<TFormInput>;
	label?: string;
	defaultText?: string;
	defaultValue?: string[];
	useTextArea?: boolean;
	labelBackground?: keyof typeof StandartBackgroundColor;
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
	fieldMinHeight?: CSSProperties["minHeight"];
	fieldHeight?: CSSProperties["height"];
	width?: CSSProperties["width"];
} & InputHTMLAttributes<HTMLInputElement>;

export function TextArrayInput<TFormInput extends FieldValues>({
	fieldName,
	label = fieldName,
	defaultText = "",
	useTextArea,
	...rest
}: TextArrayInputProps<TFormInput>) {
	return (
		<ObjectArrayInput
			fieldName={fieldName}
			label={label}
			defaultObject={defaultText as unknown as object}
			{...rest}
			childrenGenerator={({ index, lastRef }) => (
				<ObjectArrayTextInput
					className={
						useTextArea
							? styles.textArrayTextAreaInputField
							: styles.textArrayInputField
					}
					fieldName={fieldName}
					objectKey={null}
					index={index}
					useTextArea={useTextArea}
					ref={lastRef}
				/>
			)}
		/>
	);
}
