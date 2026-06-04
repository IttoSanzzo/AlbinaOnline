"use client";

import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { CSSProperties, InputHTMLAttributes, useRef } from "react";
import {
	FieldPathValue,
	FieldValues,
	Path,
	useController,
} from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useHookedForm } from "../../context/HookedFormContext";
import { StpIcon } from "@/libs/stp@icons";
import { LintIgnoredAny } from "@/libs/stp@types";

const TextArrayInputContainer = newStyledElement.div(
	styles.textArrayInputContainer,
);
const TextArraysContainer = newStyledElement.div(styles.textArraysContainer);
const TextArrayInputFieldContainer = newStyledElement.div(
	styles.textArrayInputFieldContainer,
);
const TextArrayInputRemovalButton = newStyledElement.button(
	styles.textArrayInputRemovalButton,
);
const TextArrayInputField = newStyledElement.input(styles.textArrayInputField);
const TextArrayInputLabel = newStyledElement.label(styles.textArrayInputLabel);
const TextArrayInputError = newStyledElement.div(styles.textArrayInputError);
const TextArrayNewRowButton = newStyledElement.button(
	styles.textArrayNewRowButton,
);

type TextArrayInputProps<TFormInput> = {
	fieldName: Path<TFormInput>;
	label?: string;
	labelBackground?: keyof typeof StandartBackgroundColor;
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
	textCentered?: boolean;
	width?: CSSProperties["width"];
} & InputHTMLAttributes<HTMLInputElement>;

export function TextArrayInput<TFormInput extends FieldValues>({
	fieldName,
	label = fieldName,
	labelBackground,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	width,
	...rest
}: TextArrayInputProps<TFormInput>) {
	const lastInputRef = useRef<HTMLInputElement | null>(null);

	const {
		form: {
			control,
			formState: { errors },
		},
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
		defaultValue: [] as FieldPathValue<TFormInput, Path<TFormInput>>,
	});

	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(textCentered && { textAlign: "center" }),
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
		...style,
	};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	const errorIndex = Array.isArray(errors[fieldName])
		? errors[fieldName].findIndex(
				(error) => error && error.message != undefined,
			)
		: -1;
	const errorMessage: string | undefined =
		fieldState.error?.message ??
		(errorIndex != -1
			? (errors[fieldName] as unknown as LintIgnoredAny)[errorIndex].message
			: undefined);

	return (
		<TextArrayInputContainer style={{ width: width }}>
			<TextArrayInputLabel
				children={`${label} - ${(field.value as string[]).length}`}
				style={labelStyle}
			/>
			{errorMessage && (
				<TextArrayInputError>{errorMessage}</TextArrayInputError>
			)}
			<TextArraysContainer>
				{(field.value as string[]).map((value, index) => (
					<TextArrayInputFieldContainer key={index}>
						<TextArrayInputField
							style={inputStyle}
							value={value ?? ""}
							{...rest}
							ref={index == field.value.length - 1 ? lastInputRef : undefined}
							onChange={(event) => {
								event.preventDefault();
								field.value[index] = event.target.value;
								field.onChange(field.value);
								triggerDebounceAction();
							}}
						/>
						<TextArrayInputRemovalButton
							tabIndex={-1}
							disabled={rest.disabled}
							type="button"
							onClick={(event) => {
								event.preventDefault();
								field.onChange([
									...(field.value as string[]).filter(
										(_, rmIndex) => index != rmIndex,
									),
								]);
							}}>
							<StpIcon
								name="Trash"
								style="thin"
								color="red"
							/>
						</TextArrayInputRemovalButton>
					</TextArrayInputFieldContainer>
				))}
			</TextArraysContainer>
			<TextArrayNewRowButton
				type="button"
				disabled={rest.disabled}
				className={
					(field.value as string[]).length == 0
						? styles.isEmptyArray
						: undefined
				}
				onClick={(event) => {
					event.preventDefault();
					field.onChange([...field.value, ""]);
					setTimeout(() => {
						if (lastInputRef.current) lastInputRef.current.focus();
					}, 100);
				}}>
				<StpIcon
					name="ArrowLineDown"
					color="default"
					style="thin"
				/>
			</TextArrayNewRowButton>
		</TextArrayInputContainer>
	);
}
