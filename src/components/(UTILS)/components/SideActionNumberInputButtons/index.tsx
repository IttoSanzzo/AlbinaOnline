"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";

function numberWithBounds(min?: number, max?: number) {
	let value = z.coerce.number();
	if (min !== undefined) value = value.min(min, `Mínimo de ${min}`);
	if (max !== undefined) value = value.max(max, `Máximo de ${max}`);
	return value;
}

type SideActionNumberInputButtonsProps = {
	defaultValue?: number;
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
	min?: number;
	max?: number;
	step?: number;
	debounceMiliseconds?: number;
	action: (value: number) => void;
	style?: React.CSSProperties;
	className?: string;
};

export function SideActionNumberInputButtons({
	defaultValue = 0,
	fontSize,
	style,
	min,
	max,
	step,
	className,
	action,
	debounceMiliseconds,
}: SideActionNumberInputButtonsProps) {
	const schema = z.object({
		currentValue: numberWithBounds(min, max),
	});
	type FormData = z.infer<typeof schema>;

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			currentValue: defaultValue,
		},
	});
	async function handleWatchedAction(currentValues: FormData) {
		action(currentValues.currentValue);
		return true;
	}

	return (
		<HookedForm.Form
			form={form}
			onChangeAction={handleWatchedAction}
			actionDebounceMs={debounceMiliseconds}
			className={className}>
			<HookedForm.NumberInputInline<FormData>
				fieldName={"currentValue"}
				step={step}
				style={style}
				fontSize={fontSize}
				min={min}
				max={max}
			/>
		</HookedForm.Form>
	);
}
