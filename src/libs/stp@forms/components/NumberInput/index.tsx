import {
	NumberInputContainer,
	NumberInputError,
	NumberInputLabel,
} from "./styledElements";
import { CSSProperties, InputHTMLAttributes } from "react";
import { Control, Path, useController } from "react-hook-form";
import { NumberInputInline } from "../NumberInputInline";
import clsx from "clsx";

type ExtractFieldValues<T> = T extends Control<infer U> ? U : never;

type NumberInputProps<TControl extends Control<any>> = {
	control: TControl;
	fieldName: Path<ExtractFieldValues<TControl>>;
	label: string;
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
	min?: number;
	max?: number;
	step?: number;
} & InputHTMLAttributes<HTMLInputElement>;

export function NumberInput<TControl extends Control<any>>({
	control,
	fieldName,
	label,
	lesserPadding = false,
	fontSize,
	style,
	className,
	...rest
}: NumberInputProps<TControl>) {
	const { fieldState } = useController({
		name: fieldName,
		control,
	});

	const inputStyle: CSSProperties = {
		padding: lesserPadding
			? "var(--sp-4) var(--sp-4)"
			: "var(--sp-5) var(--sp-4)",
		...style,
	};

	return (
		<NumberInputContainer>
			<NumberInputLabel children={label} />
			{fieldState.error && (
				<NumberInputError>{fieldState.error.message}</NumberInputError>
			)}
			<NumberInputInline
				control={control}
				className={clsx(className, "withButtonPadding")}
				fieldName={fieldName}
				fontSize={fontSize}
				style={inputStyle}
				{...rest}
			/>
		</NumberInputContainer>
	);
}
