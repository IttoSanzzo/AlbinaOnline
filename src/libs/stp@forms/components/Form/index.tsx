import React from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { HookedFormContextProvider } from "../..";

const FormContainer = newStyledElement.form(styles.formContainer);

interface FormProps<TFormData extends FieldValues>
	extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
	form: UseFormReturn<any, any, TFormData>;
	onSubmit?: (data: TFormData) => void;
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
	return (
		<FormContainer
			onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
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
