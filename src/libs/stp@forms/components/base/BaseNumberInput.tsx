"use client";

import { StpIcon } from "@/libs/stp@icons";
import { CSSProperties, InputHTMLAttributes, useRef } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./BaseNumberInput.module.css";
import { StandartTextColor } from "@/components/(UIBasics)";
import { useHookedForm } from "../../context/HookedFormContext";

const BaseNumberInputFieldContainer = newStyledElement.div(
	styles.baseNumberInputFieldContainer,
);
const BaseNumberInputField = newStyledElement.input(
	styles.baseNumberInputField,
);
const BaseNumberInputDecrementButton = newStyledElement.button(
	styles.baseNumberInputDecrementButton,
);
const BaseNumberInputIncrementButton = newStyledElement.button(
	styles.baseNumberInputIncrementButton,
);

export type BaseNumberInputProps<TFormData> = {
	fieldName: Path<TFormData>;
	objectIndex?: number | null;
	objectKey?: string | null;
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
	useScrollControl?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function BaseNumberInput<TFormData extends FieldValues>({
	fieldName,
	objectKey = null,
	objectIndex = null,
	fontSize,
	style,
	min,
	max,
	step,
	className,
	color,
	useScrollControl,
	...rest
}: BaseNumberInputProps<TFormData>) {
	const previousScrollTop = useRef(0);
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

	const currentValue =
		objectIndex != null
			? objectKey != null
				? field.value[objectIndex][objectKey]
				: field.value[objectIndex]
			: field.value;

	function setValue(newValue: number | string) {
		if (objectIndex != null) {
			if (objectKey != null) field.value[objectIndex][objectKey] = newValue;
			else field.value[objectIndex] = newValue;
			field.onChange(field.value);
		} else field.onChange(newValue);
	}

	function handleDecrement() {
		const newValue: number =
			(isNaN(currentValue) ? 0 : currentValue) - (step ?? 1);
		const finalNewValue =
			min != undefined ? (newValue < min ? min : newValue) : newValue;
		setValue(finalNewValue);
		triggerDebounceAction();
	}
	function handleIncrement() {
		const newValue: number =
			(isNaN(currentValue) ? 0 : currentValue) + (step ?? 1);
		const finalNewValue = max ? (newValue > max ? max : newValue) : newValue;
		setValue(finalNewValue);
		triggerDebounceAction();
	}
	function handleWheel(event: React.WheelEvent<HTMLInputElement>) {
		if (event.deltaY < 0) handleIncrement();
		else if (event.deltaY > 0) handleDecrement();
	}

	return (
		<BaseNumberInputFieldContainer className={className}>
			<BaseNumberInputDecrementButton
				disabled={min != undefined && currentValue <= min}
				type="button"
				tabIndex={-1}
				onClick={handleDecrement}
				children={StpIcon({ name: "LessThan" })}
			/>
			<BaseNumberInputField
				type="number"
				style={inputStyle}
				max={max}
				min={min}
				step={step}
				onWheel={useScrollControl ? handleWheel : undefined}
				{...field}
				value={currentValue ?? ""}
				{...rest}
				onChange={(event) => {
					const value =
						event.target.value === "" ? 0 : Number(event.target.value);
					event.target.value = value.toString();
					setValue(value);
					triggerDebounceAction();
				}}
			/>
			<BaseNumberInputIncrementButton
				disabled={max != undefined && currentValue >= max}
				type="button"
				tabIndex={-1}
				onClick={handleIncrement}
				children={StpIcon({ name: "GreaterThan" })}
			/>
		</BaseNumberInputFieldContainer>
	);
}
