import { CSSProperties, TextareaHTMLAttributes } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { useHookedForm } from "../../context/HookedFormContext";

const TextAreaInputContainer = newStyledElement.div(
	styles.textAreaInputContainer
);
const TextAreaInputField = newStyledElement.textarea(styles.textAreaInputField);
const TextAreaInputLabel = newStyledElement.label(styles.textAreaInputLabel);
const TextAreaInputError = newStyledElement.div(styles.textAreaInputError);

type TextAreaInputProps<TFormInput> = {
	fieldName: Path<TFormInput>;
	label: string;
	labelBackground?: keyof typeof StandartBackgroundColor;
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
export function TextAreaInput<TFormInput extends FieldValues>({
	fieldName,
	label,
	labelBackground,
	height,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	...rest
}: TextAreaInputProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
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
			backgroundColor: StandartBackgroundColor[labelBackground],
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
				onChange={(event) => {
					field.onChange(event);
					triggerDebounceAction();
				}}
			/>
		</TextAreaInputContainer>
	);
}
