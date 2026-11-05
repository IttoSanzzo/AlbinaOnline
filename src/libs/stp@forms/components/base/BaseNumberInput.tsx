"use client";

import { StpIcon } from "@/libs/stp@icons";
import {
	CSSProperties,
	KeyboardEvent,
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
	enforceStep?: boolean;
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
	enforceStep = true,
	className,
	color,
	useScrollControl = true,
	onKeyDown,
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

	function handleStep(direction: -1 | 1) {
		const numericValue = Number(currentValue);
		const currentNumericValue = isNaN(numericValue) ? 0 : numericValue;
		const stepValue = step ?? 1;
		const quotient = currentNumericValue / stepValue;
		const roundedValue =
			(direction === 1 ? Math.floor(quotient) + 1 : Math.ceil(quotient) - 1) *
			stepValue;
		const finalValue = Math.max(
			min ?? -Infinity,
			Math.min(max ?? Infinity, roundedValue),
		);

		setValue(finalValue);
		triggerDebounceAction();
	}
	function handleDecrement() {
		handleStep(-1);
	}
	function handleIncrement() {
		handleStep(1);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		onKeyDown?.(event);
		if (event.defaultPrevented || enforceStep) return;
		if (event.currentTarget.disabled || event.currentTarget.readOnly) return;

		if (event.key === "ArrowUp") {
			event.preventDefault();
			handleIncrement();
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			handleDecrement();
		}
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
				step={enforceStep ? step : "any"}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...field}
				value={currentValue ?? ""}
				{...rest}
				onKeyDown={handleKeyDown}
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
