"use client";

import styles from "./AsyncSearchSelect.module.css";
import Image from "next/image";
import { CSSProperties, RefObject, useEffect, useRef, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { BaseSelectOption } from "./base/BaseSelect";
import { FieldValues, Path, useController } from "react-hook-form";
import { startCase } from "lodash";
import { useHookedForm } from "../context/HookedFormContext";

const AsyncSearchSelectContainer = newStyledElement.div(
	styles.asyncSearchSelectContainer,
);
const AsyncSearchSelectTextInput = newStyledElement.input(
	styles.asyncSearchSelectTextInput,
);
const AsyncSearchSelectLabel = newStyledElement.label(
	styles.asyncSearchSelectLabel,
);
const AsyncSearchSelectError = newStyledElement.div(
	styles.asyncSearchSelectError,
);
const DropdownContainer = newStyledElement.div(styles.dropdownContainer);
const SelectOptionButton = newStyledElement.button(styles.selectOptionButton);

interface AsyncSearchSelectProps<TFormInput> {
	fieldName: Path<TFormInput>;
	autoLabelFormatting?: boolean;
	ref?: RefObject<HTMLInputElement | null>;
	label?: string;
	labelBackground?: keyof typeof StandartBackgroundColor;
	placeholder?: string;
	width?: CSSProperties["width"];
	defaultValue?: string;
	disabled?: boolean;
	queryMinLength?: number;
	optionGenerator: (
		query: string,
	) => BaseSelectOption[] | Promise<BaseSelectOption[]>;
	debounceMs?: number;
}
export function AsyncSearchSelect<TFormInput extends FieldValues>({
	fieldName,
	autoLabelFormatting = true,
	label = autoLabelFormatting ? startCase(fieldName) : fieldName,
	labelBackground,
	width,
	placeholder,
	disabled,
	queryMinLength = 2,
	optionGenerator,
	debounceMs = 250,
}: AsyncSearchSelectProps<TFormInput>) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [inputText, setInputText] = useState("");
	const [options, setOptions] = useState<BaseSelectOption[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
	});

	useEffect(() => {
		if (!isOpen) return;
		function onPointerDown(event: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			)
				setIsOpen(false);
		}
		document.addEventListener("pointerdown", onPointerDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [isOpen]);

	useEffect(() => {
		if (inputText.length < queryMinLength) {
			setOptions([]);
			return;
		}
		const timeout = setTimeout(async () => {
			setOptions(await optionGenerator(inputText));
		}, debounceMs);
		return () => clearTimeout(timeout);
	}, [inputText, debounceMs, queryMinLength]);

	return (
		<AsyncSearchSelectContainer
			style={{ width }}
			ref={containerRef}>
			{fieldState.error && (
				<AsyncSearchSelectError>
					{fieldState.error.message}
				</AsyncSearchSelectError>
			)}
			<AsyncSearchSelectTextInput
				onFocus={() => setIsOpen(true)}
				value={inputText}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(event) => {
					event.preventDefault();
					setInputText(event.target.value);
					setIsOpen(true);
				}}
				onKeyDown={(event) => {
					if (event.key != "Escape") return;
					event.preventDefault();
					setIsOpen(false);
				}}
			/>
			{isOpen && (
				<DropdownContainer>
					{options.map((option, index) => (
						<SelectOptionButton
							key={`${index}|${option.name}`}
							type="button"
							onClick={(event) => {
								event.preventDefault();
								setInputText(option.name);
								setIsOpen(false);
								field.onChange(option.value);
								triggerDebounceAction();
							}}>
							{option.icon && (
								<Image
									src={option.icon}
									alt=""
									width={28}
									height={28}
								/>
							)}
							<p>{option.name}</p>
						</SelectOptionButton>
					))}
					{options.length == 0 && (
						<div className={styles.noOptions}>No Options</div>
					)}
				</DropdownContainer>
			)}
			<AsyncSearchSelectLabel
				style={{
					...(labelBackground && {
						backgroundColor: StandartBackgroundColor[labelBackground],
					}),
				}}
				children={label}
			/>
		</AsyncSearchSelectContainer>
	);
}
