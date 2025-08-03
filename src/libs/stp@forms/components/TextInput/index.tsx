import { NotionBackgroundColor } from "@/components/(NotionBased)";
import {
	TextInputContainer,
	TextInputError,
	TextInputField,
	TextInputLabel,
} from "./styledElements";
import { CSSProperties, InputHTMLAttributes } from "react";
import { Control, Path, useController } from "react-hook-form";

type ExtractFieldValues<T> = T extends Control<infer U> ? U : never;

type TextInputProps<TControl extends Control<any>> = {
	control: TControl;
	fieldName: Path<ExtractFieldValues<TControl>>;
	label: string;
	labelBackground?: keyof typeof NotionBackgroundColor;
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
			backgroundColor: NotionBackgroundColor[labelBackground],
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
