"use client";

import { HookedForm, SelectOption, zEnumKey, zSlug } from "@/libs/stp@forms";
import { LintIgnoredAny, SpellSubType, SpellType } from "@/libs/stp@types";
import { enumToSelectOptions } from "@/utils/Data";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(SpellType, []),
	subType: zEnumKey(SpellSubType, []),
});
type FormData = z.infer<typeof schema>;

interface CreationFormProps {
	form: UseFormReturn<LintIgnoredAny, unknown, LintIgnoredAny>;
}
export function CreationForm({ form }: CreationFormProps) {
	console.log(form.watch);

	const typeOptions: SelectOption[] = enumToSelectOptions(SpellType, []);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(SpellSubType, []);

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
