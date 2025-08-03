import { NotionBackgroundColor } from "@/components/(NotionBased)";
import { CSSProperties, TextareaHTMLAttributes } from "react";
import { Control, Path, useController } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const TextAreaInputContainer = newStyledElement.div(
	styles.textAreaInputContainer
);
export const TextAreaInputField = newStyledElement.textarea(
	styles.textAreaInputField
);
export const TextAreaInputLabel = newStyledElement.label(
	styles.textAreaInputLabel
);
export const TextAreaInputError = newStyledElement.div(
	styles.textAreaInputError
);

type ExtractFieldValues<T> = T extends Control<infer U> ? U : never;

type TextAreaInputProps<TControl extends Control<any>> = {
	control: TControl;
	fieldName: Path<ExtractFieldValues<TControl>>;
	label: string;
	labelBackground?: keyof typeof NotionBackgroundColor;
	height?: React.CSSProperties["height"];
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
} & TextareaHTMLAttributes<HTMLTextAreaElement>;
export function TextAreaInput<TControl extends Control<any>>({
	control,
	fieldName,
	label,
	labelBackground,
	height,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	...rest
}: TextAreaInputProps<TControl>) {
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
	});

	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(textCentered && { textAlign: "center" }),
		height: height,
		...style,
	};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: NotionBackgroundColor[labelBackground],
		}),
	};

	return (
		<TextAreaInputContainer>
			<TextAreaInputLabel
				children={label}
				style={labelStyle}
			/>
			{fieldState.error && (
				<TextAreaInputError>{fieldState.error.message}</TextAreaInputError>
			)}
			<TextAreaInputField
				style={inputStyle}
				{...field}
				value={field.value ?? ""}
				{...rest}
			/>
		</TextAreaInputContainer>
	);
}
