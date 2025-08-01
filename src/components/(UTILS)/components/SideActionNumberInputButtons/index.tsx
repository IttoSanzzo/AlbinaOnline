"use client";

import { StpIcon } from "@/libs/stp@icons";
import { CSSProperties, InputHTMLAttributes, useEffect, useRef } from "react";
import { useController, useForm } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import z from "zod";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";

export const NumberInputFieldContainer = newStyledElement.div(
	styles.numberInputFieldContainer
);
export const NumberInputField = newStyledElement.input(styles.numberInputField);
export const NumberInputDecrementButton = newStyledElement.button(
	styles.numberInputDecrementButton
);
export const NumberInputIncrementButton = newStyledElement.button(
	styles.numberInputIncrementButton
);

function numberWithBounds(min?: number, max?: number) {
	let value = z.coerce.number();
	if (min !== undefined) value = value.min(min, `Mínimo de ${min}`);
	if (max !== undefined) value = value.max(max, `Máximo de ${max}`);
	return value;
}

type SideActionNumberInputButtonsProps = {
	defaultValue?: number;
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
	debounceMiliseconds?: number;
	action: (value: number) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export function SideActionNumberInputButtons({
	defaultValue = 0,
	fontSize,
	style,
	min,
	max,
	step,
	className,
	action,
	debounceMiliseconds = 800,
	...rest
}: SideActionNumberInputButtonsProps) {
	const schema = z.object({
		currentValue: numberWithBounds(min, max),
	});
	type FormData = z.infer<typeof schema>;
	const {
		control,
		formState: { isValid },
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			currentValue: defaultValue,
		},
	});
	const { field } = useController({
		name: "currentValue",
		control,
	});

	async function handleWatchAction(currentValues: FormData) {
		action(currentValues.currentValue);
		return true;
	}

	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...style,
	};

	function handleDecrement() {
		const newValue: number = (field.value ?? 0) - (step ? step : 1);
		field.onChange(
			min != undefined ? (newValue < min ? min : newValue) : newValue
		);
	}
	function handleIncrement() {
		const newValue: number = (field.value ?? 0) + (step ? step : 1);
		field.onChange(max ? (newValue > max ? max : newValue) : newValue);
	}

	return (
		// <HookedForm.Form>
		<NumberInputFieldContainer className={className}>
			<HookedForm.WatchedAction<FormData>
				watch={watch}
				isValid={isValid}
				action={handleWatchAction}
			/>
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
				{...rest}
			/>
			<NumberInputIncrementButton
				disabled={max != undefined && field.value >= max}
				type="button"
				onClick={handleIncrement}
				children={StpIcon({ name: "GreaterThan" })}
			/>
		</NumberInputFieldContainer>
		// </HookedForm.Form>
	);
}
