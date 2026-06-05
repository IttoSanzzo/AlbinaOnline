"use client";

import { InputHTMLAttributes } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { useHookedForm } from "../../context/HookedFormContext";
import { BaseTextInput, BaseTextInputProps } from "../base/BaseTextInput";

interface TextInputProps<TFormInput>
	extends BaseTextInputProps, InputHTMLAttributes<HTMLInputElement> {
	fieldName: Path<TFormInput>;
}

export function TextInput<TFormInput extends FieldValues>({
	fieldName,
	label = fieldName,
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
				field.onChange(event);
				triggerDebounceAction();
			}}
			{...rest}
		/>
	);
}
