import { StpIcon } from "@/libs/stp@icons";
import {
	NumberInputDecrementButton,
	NumberInputField,
	NumberInputFieldContainer,
	NumberInputIncrementButton,
} from "./styledElements";
import { CSSProperties, InputHTMLAttributes } from "react";
import { Control, Path, useController } from "react-hook-form";
import { NotionTextColor } from "@/components/(NotionBased)";

type ExtractFieldValues<T> = T extends Control<infer U> ? U : never;

type NumberInputInlineProps<TControl extends Control<any>> = {
	control: TControl;
	fieldName: Path<ExtractFieldValues<TControl>>;
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
	min?: number;
	max?: number;
	step?: number;
	color?: keyof typeof NotionTextColor;
} & InputHTMLAttributes<HTMLInputElement>;

export function NumberInputInline<TControl extends Control<any>>({
	control,
	fieldName,
	fontSize,
	style,
	min,
	max,
	step,
	className,
	color,
	...rest
}: NumberInputInlineProps<TControl>) {
	const { field } = useController({
		name: fieldName,
		control,
	});

	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(color && { color: NotionTextColor[color] }),
		...style,
	};

	function handleDecrement() {
		const newValue: number = (Number(field.value) ?? 0) - (step ? step : 1);
		field.onChange(
			min != undefined ? (newValue < min ? min : newValue) : newValue
		);
	}
	function handleIncrement() {
		const newValue: number = (Number(field.value) ?? 0) + (step ? step : 1);
		field.onChange(max ? (newValue > max ? max : newValue) : newValue);
	}

	return (
		<NumberInputFieldContainer className={className}>
			<NumberInputDecrementButton
				disabled={min != undefined && field.value <= min}
				type="button"
				onClick={handleDecrement}
				children={StpIcon({ name: "LessThan" })}
			/>
			<NumberInputField
				type="number"
				style={inputStyle}
				max={max}
				min={min}
				step={step}
				{...field}
				value={field.value ?? ""}
				{...rest}
			/>
			<NumberInputIncrementButton
				disabled={max != undefined && field.value >= max}
				type="button"
				onClick={handleIncrement}
				children={StpIcon({ name: "GreaterThan" })}
			/>
		</NumberInputFieldContainer>
	);
}
