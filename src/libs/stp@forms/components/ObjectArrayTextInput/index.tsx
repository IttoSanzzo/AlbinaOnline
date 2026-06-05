"use client";

import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { InputHTMLAttributes, RefObject } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { useHookedForm } from "../../context/HookedFormContext";
import { BaseTextInput } from "../base/BaseTextInput";

type ObjectArrayTextInputProps<TFormInput> = {
	fieldName: Path<TFormInput>;
	objectKey: string | null;
	label?: string;
	index: number;
	useTextArea?: boolean;
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
	ref?: RefObject<HTMLInputElement | null> | undefined;
} & InputHTMLAttributes<HTMLInputElement>;

export function ObjectArrayTextInput<TFormInput extends FieldValues>({
	fieldName,
	objectKey,
	index,
	...rest
}: ObjectArrayTextInputProps<TFormInput>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { field } = useController({
		name: fieldName,
		control: control,
	});

	return (
		<BaseTextInput
			{...rest}
			value={
				objectKey != null ? field.value[index][objectKey] : field.value[index]
			}
			onChange={(event) => {
				event.preventDefault();
				if (objectKey != null)
					field.value[index][objectKey] = event.target.value;
				else field.value[index] = event.target.value;
				field.onChange(field.value);
				triggerDebounceAction();
			}}
		/>
	);
}
