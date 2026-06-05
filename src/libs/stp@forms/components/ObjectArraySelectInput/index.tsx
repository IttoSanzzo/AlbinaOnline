"use client";

import { FieldValues, Path, useController } from "react-hook-form";
import { useHookedForm } from "../../context/HookedFormContext";
import { BaseSelect, BaseSelectProps } from "../base/BaseSelect";

type ObjectArraySelectInputProps<TFormInput> = {
	fieldName: Path<TFormInput>;
	objectKey: string | null;
	index: number;
	// ref?: RefObject<HTMLInputElement | null> | undefined;
} & BaseSelectProps;

export function ObjectArraySelectInput<TFormInput extends FieldValues>({
	fieldName,
	objectKey,
	index,
	...rest
}: ObjectArraySelectInputProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { field } = useController({
		name: fieldName,
		control: control,
	});

	return (
		<BaseSelect
			{...rest}
			value={
				objectKey != null ? field.value[index][objectKey] : field.value[index]
			}
			onValueChange={(value) => {
				if (objectKey != null) field.value[index][objectKey] = value;
				else field.value[index] = value;
				field.onChange(field.value);
				triggerDebounceAction();
			}}
		/>
	);
}
