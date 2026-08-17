"use client";

import { StpIcon } from "@/libs/stp@icons";
import {
	CSSProperties,
	InputHTMLAttributes,
	useEffect,
	useRef,
	useState,
} from "react";
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
	useScrollControl = true,
	...rest
}: BaseNumberInputProps<TFormData>) {
	const containerRef = useRef<HTMLElement | null>(null);
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);

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
		const finalNewValue =
			max != undefined ? (newValue > max ? max : newValue) : newValue;
		setValue(finalNewValue);
		triggerDebounceAction();
	}

	function handleMouseEnter() {
		if (!useScrollControl) return;
		setScrollEnabled(false);
		if (hoverTimer.current != null) clearTimeout(hoverTimer.current);

		hoverTimer.current = setTimeout(() => {
			setScrollEnabled(true);
			hoverTimer.current = null;
		}, 300);
	}

	function handleMouseLeave() {
		setScrollEnabled(false);
		if (hoverTimer.current != null) {
			clearTimeout(hoverTimer.current);
			hoverTimer.current = null;
		}
	}

	useEffect(() => {
		const element = containerRef.current;
		if (!useScrollControl || !scrollEnabled || !element) return;

		function handleWheel(event: WheelEvent) {
			event.preventDefault();
			if (event.deltaY < 0) handleIncrement();
			else if (event.deltaY > 0) handleDecrement();
		}

		element.addEventListener("wheel", handleWheel, {
			passive: false,
		});
		return () => {
			element.removeEventListener("wheel", handleWheel);
		};
	}, [useScrollControl, scrollEnabled, currentValue, step, min, max]);

	const activeScrollClassName =
		useScrollControl && scrollEnabled
			? styles.scrollControlActivated
			: undefined;

	return (
		<BaseNumberInputFieldContainer
			className={className}
			ref={containerRef}>
			<BaseNumberInputDecrementButton
				disabled={min != undefined && currentValue <= min}
				type="button"
				tabIndex={-1}
				onClick={handleDecrement}
				children={StpIcon({ name: "LessThan" })}
				className={activeScrollClassName}
			/>
			<BaseNumberInputField
				type="number"
				style={inputStyle}
				max={max}
				min={min}
				step={step}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
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
				className={activeScrollClassName}
			/>
		</BaseNumberInputFieldContainer>
	);
}
