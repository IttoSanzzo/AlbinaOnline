"use client";

import { FieldValues, Path, useController } from "react-hook-form";
import { CSSProperties } from "react";
import { useHookedForm } from "../../context/HookedFormContext";
import { BaseSelect } from "../base/BaseSelect";

export type SelectOption = {
	value: string | number;
	name: string;
	icon?: string;
};

type SelectProps<TFormInput extends FieldValues> = {
	fieldName: Path<TFormInput>;
	label: string;
	placeholder?: string;
	options: SelectOption[];
	width?: CSSProperties["width"];
	defaultValue?: string;
};
export function SelectComponent<TFormInput extends FieldValues>({
	fieldName,
	...rest
}: SelectProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const {
		field,
		fieldState: { error },
	} = useController({
		name: fieldName,
		control: control,
	});

	return (
		<BaseSelect
			value={field.value ?? ""}
			errorMessage={error?.message}
			onValueChange={(event) => {
				field.onChange(event);
				triggerDebounceAction();
			}}
			{...rest}
		/>
	);
}
