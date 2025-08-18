import { StpIcon } from "@/libs/stp@icons";
import { CSSProperties, InputHTMLAttributes } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "@/components/(UIBasics)";
import { useHookedForm } from "../../context/HookedFormContext";

const NumberInputFieldContainer = newStyledElement.div(
	styles.numberInputFieldContainer
);
const NumberInputField = newStyledElement.input(styles.numberInputField);
const NumberInputDecrementButton = newStyledElement.button(
	styles.numberInputDecrementButton
);
const NumberInputIncrementButton = newStyledElement.button(
	styles.numberInputIncrementButton
);

type NumberInputInlineProps<TFormData> = {
	fieldName: Path<TFormData>;
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
	color?: keyof typeof StandartTextColor;
} & InputHTMLAttributes<HTMLInputElement>;

export function NumberInputInline<TFormData extends FieldValues>({
	fieldName,
	fontSize,
	style,
	min,
	max,
	step,
	className,
	color,
	...rest
}: NumberInputInlineProps<TFormData>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormData>();
	const { field } = useController({
		name: fieldName,
		control,
	});

	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(color && { color: StandartTextColor[color] }),
		...style,
	};

	function handleDecrement() {
		const newValue: number = (Number(field.value) ?? 0) - (step ? step : 1);
		field.onChange(
			min != undefined ? (newValue < min ? min : newValue) : newValue
		);
		triggerDebounceAction();
	}
	function handleIncrement() {
		const newValue: number = (Number(field.value) ?? 0) + (step ? step : 1);
		field.onChange(max ? (newValue > max ? max : newValue) : newValue);
		triggerDebounceAction();
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
				onChange={(event) => {
					field.onChange(event);
					triggerDebounceAction();
				}}
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
