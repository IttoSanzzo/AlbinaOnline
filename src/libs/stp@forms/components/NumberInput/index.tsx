import { CSSProperties, InputHTMLAttributes } from "react";
import { Control, Path, useController } from "react-hook-form";
import { NumberInputInline } from "../NumberInputInline";
import clsx from "clsx";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "@/components/(UIBasics)";

const NumberInputContainer = newStyledElement.div(styles.numberInputContainer);
const NumberInputLabel = newStyledElement.label(styles.numberInputLabel);
const NumberInputError = newStyledElement.div(styles.numberInputError);

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
	color?: keyof typeof StandartTextColor;
} & InputHTMLAttributes<HTMLInputElement>;

export function NumberInput<TControl extends Control<any>>({
	control,
	fieldName,
	label,
	lesserPadding = false,
	fontSize,
	style,
	className,
	color,
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
				color={color}
				{...rest}
			/>
		</NumberInputContainer>
	);
}
