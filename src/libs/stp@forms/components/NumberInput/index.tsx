import { CSSProperties, InputHTMLAttributes } from "react";
import { Path } from "react-hook-form";
import { NumberInputInline } from "../NumberInputInline";
import clsx from "clsx";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "@/components/(UIBasics)";

const NumberInputContainer = newStyledElement.div(styles.numberInputContainer);
const NumberInputLabel = newStyledElement.label(styles.numberInputLabel);

type NumberInputProps<TFormData> = {
	fieldName: Path<TFormData>;
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

type NewType<TFormData> = NumberInputProps<TFormData>;

export function NumberInput<TFormData>({
	fieldName,
	label,
	lesserPadding = false,
	fontSize,
	style,
	className,
	color,
	...rest
}: NewType<TFormData>) {
	const inputStyle: CSSProperties = {
		padding: lesserPadding
			? "var(--sp-4) var(--sp-4)"
			: "var(--sp-5) var(--sp-4)",
		...style,
	};

	return (
		<NumberInputContainer>
			<NumberInputLabel children={label} />
			<NumberInputInline
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
