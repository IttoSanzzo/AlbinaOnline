"use client";

import { InputHTMLAttributes, RefObject } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { useHookedForm } from "../../context/HookedFormContext";
import { BaseTextInput, BaseTextInputProps } from "../base/BaseTextInput";
import { startCase } from "lodash";

interface TextInputProps<TFormInput>
	extends BaseTextInputProps, InputHTMLAttributes<HTMLInputElement> {
	fieldName: Path<TFormInput>;
	autoLabelFormatting?: boolean;
	ref?: RefObject<HTMLInputElement | null>;
}

export function TextInput<TFormInput extends FieldValues>({
	fieldName,
	autoLabelFormatting = true,
	label = autoLabelFormatting ? startCase(fieldName) : fieldName,
	onChange,
	...rest
}: TextInputProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
	});

	return (
		<BaseTextInput
			label={label}
			{...field}
			errorMessage={fieldState.error?.message}
			value={field.value ?? ""}
			onChange={(event) => {
				if (onChange) onChange(event);
				field.onChange(event);
				triggerDebounceAction();
			}}
			{...rest}
		/>
	);
}
