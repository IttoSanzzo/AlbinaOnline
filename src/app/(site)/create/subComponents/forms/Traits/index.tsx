"use client";

import { HookedForm, SelectOption, zEnumKey, zSlug } from "@/libs/stp@forms";
import { LintIgnoredAny, TraitSubType, TraitType } from "@/libs/stp@types";
import { enumToSelectOptions } from "@/utils/Data";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(TraitType, ["Unknown"]),
	subType: zEnumKey(TraitSubType, []),
});
type FormData = z.infer<typeof schema>;

interface CreationFormProps {
	form: UseFormReturn<LintIgnoredAny, unknown, LintIgnoredAny>;
}
export function CreationForm({ form }: CreationFormProps) {
	console.log(form.watch);
	const typeOptions: SelectOption[] = enumToSelectOptions(TraitType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(TraitSubType, []);

	return (
		<>
			<HookedForm.TextInput<FormData>
				fieldName="slug"
				label="Slug"
			/>
			<HookedForm.TextInput<FormData>
				fieldName="name"
				label="Name"
			/>
			<HookedForm.Select<FormData>
				fieldName="type"
				placeholder="Select Type"
				label="Type"
				options={typeOptions}
			/>
			<HookedForm.Select<FormData>
				fieldName="subType"
				placeholder="Select SubType"
				label="SubType"
				options={subTypeOptions}
			/>
		</>
	);
}
