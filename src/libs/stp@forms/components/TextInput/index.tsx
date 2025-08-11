import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { CSSProperties, InputHTMLAttributes } from "react";
import { Control, Path, useController } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const TextInputContainer = newStyledElement.div(styles.textInputContainer);
const TextInputField = newStyledElement.input(styles.textInputField);
const TextInputLabel = newStyledElement.label(styles.textInputLabel);
const TextInputError = newStyledElement.div(styles.textInputError);

type ExtractFieldValues<T> = T extends Control<infer U> ? U : never;

type TextInputProps<TControl extends Control<any>> = {
	control: TControl;
	fieldName: Path<ExtractFieldValues<TControl>>;
	label: string;
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
} & InputHTMLAttributes<HTMLInputElement>;

export function TextInput<TControl extends Control<any>>({
	control,
	fieldName,
	label,
	labelBackground,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	...rest
}: TextInputProps<TControl>) {
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
	});

	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(textCentered && { textAlign: "center" }),
		...style,
	};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	return (
		<TextInputContainer>
			<TextInputLabel
				children={label}
				style={labelStyle}
			/>
			{fieldState.error && (
				<TextInputError>{fieldState.error.message}</TextInputError>
			)}
			<TextInputField
				style={inputStyle}
				{...field}
				value={field.value ?? ""}
				{...rest}
			/>
		</TextInputContainer>
	);
}
