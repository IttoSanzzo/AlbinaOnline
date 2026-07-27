"use client";

import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { ButtonHTMLAttributes, CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { FieldValues, Path, useController } from "react-hook-form";
import { useHookedForm } from "../../context/HookedFormContext";
import { startCase } from "lodash";

const BoolInputContainer = newStyledElement.div(styles.boolInputContainer);
const BoolInputButton = newStyledElement.button(styles.boolInputButton);
const BoolInputLabel = newStyledElement.label(styles.boolInputLabel);
const BoolInputError = newStyledElement.div(styles.boolInputError);

export type BoolInputProps<TFormInput> = {
	fieldName: Path<TFormInput>;
	autoLabelFormatting?: boolean;
	label?: string;
	labelBackground?: keyof typeof StandartBackgroundColor;
	lesserPadding?: boolean;
	trueMessage?: string;
	trueBackgroundColor?: keyof typeof StandartBackgroundColor;
	falseMessage?: string;
	falseBackgroundColor?: keyof typeof StandartBackgroundColor;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BoolInput<TFormInput extends FieldValues>({
	fieldName,
	autoLabelFormatting = true,
	label = autoLabelFormatting ? startCase(fieldName) : fieldName,
	onChange,
	labelBackground,
	lesserPadding = false,
	trueMessage = "True",
	trueBackgroundColor,
	falseMessage = "False",
	falseBackgroundColor,
	style,
	...rest
}: BoolInputProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
	});

	const backgroundColor =
		field.value == true
			? (trueBackgroundColor ?? labelBackground)
			: (falseBackgroundColor ?? labelBackground);
	const inputStyle: CSSProperties = {
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(backgroundColor && {
			backgroundColor: StandartBackgroundColor[backgroundColor],
		}),
		...style,
	};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	return (
		<BoolInputContainer>
			<BoolInputLabel
				children={label}
				style={labelStyle}
			/>
			{fieldState.error && (
				<BoolInputError>{fieldState.error.message}</BoolInputError>
			)}
			<BoolInputButton
				type="button"
				style={inputStyle}
				onClick={(event) => {
					event.preventDefault();
					field.onChange(!field.value);
					if (onChange) onChange(event);
					triggerDebounceAction();
				}}
				{...rest}>
				{field.value == true ? trueMessage : falseMessage}
			</BoolInputButton>
		</BoolInputContainer>
	);
}
