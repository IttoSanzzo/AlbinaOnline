import { LintIgnoredAny } from "@/libs/stp@types";
import { createContext, useCallback, useContext, useRef } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type AnyFormValues = LintIgnoredAny;

interface FormContextValue<TFormData extends FieldValues> {
	form: UseFormReturn<AnyFormValues, unknown, TFormData>;
	triggerDebounceAction: () => void;
}

const HookedFormContext = createContext<FormContextValue<AnyFormValues> | null>(
	null
);

export function useHookedForm<TFormData extends FieldValues>() {
	const context = useContext(HookedFormContext);
	if (!context)
		throw new Error("useHookedForm must be used inside HookedForm.Form");
	return context as FormContextValue<TFormData>;
}

interface HookedFormContextProviderProps<TFormData extends FieldValues> {
	form: UseFormReturn<AnyFormValues, unknown, TFormData>;
	debounceMs?: number;
	onChangeAction?: (data: TFormData) => void;
	children: React.ReactNode;
}

export function HookedFormContextProvider<TFormData extends FieldValues>({
	form,
	debounceMs = 800,
	onChangeAction,
	children,
}: HookedFormContextProviderProps<TFormData>) {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const triggerDebounceAction = useCallback(() => {
		if (!onChangeAction) return;
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			onChangeAction(form.getValues() as TFormData);
		}, debounceMs);
	}, [form, debounceMs, onChangeAction]);

	return (
		<HookedFormContext.Provider
			value={{
				form: form,
				triggerDebounceAction: triggerDebounceAction,
			}}>
			{children}
		</HookedFormContext.Provider>
	);
}
