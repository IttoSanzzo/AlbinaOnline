import {
	TextInputContainer,
	TextInputError,
	TextInputField,
	TextInputLabel,
} from "./styledElements";
import { CSSProperties, InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type TextInputProps = {
	field: UseFormRegisterReturn;
	label: string;
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
} & InputHTMLAttributes<HTMLInputElement>;

export function TextInput({
	field,
	label,
	errorMessage,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	...rest
}: TextInputProps) {
	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(textCentered && { textAlign: "center" }),
		...style,
	};

	return (
		<TextInputContainer>
			<TextInputLabel children={label} />
			{errorMessage && <TextInputError>{errorMessage}</TextInputError>}
			<TextInputField
				style={inputStyle}
				{...field}
				{...rest}
			/>
		</TextInputContainer>
	);
}
