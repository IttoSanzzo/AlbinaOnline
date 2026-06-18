"use client;";

import React from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { HookedFormContextProvider } from "../..";
import { AnyFormValues } from "../../context/HookedFormContext";
import { isBoolean } from "lodash";

const FormContainer = newStyledElement.form(styles.formContainer);

interface FormProps<TFormData extends FieldValues> extends Omit<
	React.FormHTMLAttributes<HTMLFormElement>,
	"onSubmit"
> {
	form: UseFormReturn<AnyFormValues, unknown, TFormData>;
	onSubmit?: (
		data: TFormData,
	) =>
		| void
		| Promise<void>
		| boolean
		| Promise<boolean>
		| Promise<boolean | undefined>;
	onChangeAction?: (data: TFormData) => void;
	actionDebounceMs?: number;
}
export function Form<TFormData extends FieldValues>({
	form,
	onSubmit,
	children,
	onChangeAction,
	actionDebounceMs,
	...rest
}: FormProps<TFormData>) {
	async function submitHandler(data: TFormData) {
		if (onSubmit != undefined) {
			const result = await onSubmit(data);
			if (isBoolean(result) && result == true) form.reset({ ...data });
		}
	}

	return (
		<FormContainer
			onSubmit={form.handleSubmit(submitHandler)}
			onKeyDownCapture={(event) => {
				if (event.ctrlKey && event.key.toLowerCase() == "s") {
					event.preventDefault();
					if (form.formState.isSubmitting || !form.formState.isDirty) return;
					const formElement = event.currentTarget.closest("form");
					if (formElement) formElement.requestSubmit();
				}
			}}
			{...rest}>
			<HookedFormContextProvider
				form={form}
				debounceMs={actionDebounceMs}
				onChangeAction={onChangeAction}>
				{children}
			</HookedFormContextProvider>
		</FormContainer>
	);
}
