"use client";

import { HookedForm, toSlug, zEnumKey, zSlug } from "@/libs/stp@forms";
import { ItemSubType, ItemType, LintIgnoredAny } from "@/libs/stp@types";
import { enumToSelectOptions } from "@/utils/Data";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(ItemType, ["Unknown"]),
	subType: zEnumKey(ItemSubType, ["Unknown"]),
});
type FormData = z.infer<typeof schema>;

interface CreationFormProps {
	form: UseFormReturn<LintIgnoredAny, unknown, LintIgnoredAny>;
}
export function CreationForm({ form }: CreationFormProps) {
	void form;
	const typeOptions = enumToSelectOptions(ItemType, ["Unknown"]);
	const subTypeOptions = enumToSelectOptions(ItemSubType, ["Unknown"]);

	return (
		<>
			<HookedForm.TextInput<FormData>
				fieldName="name"
				label="Name"
				onChange={(event) => {
					form.setValue("slug", toSlug(event.target.value));
				}}
			/>
			<HookedForm.TextInput<FormData>
				fieldName="slug"
				label="Slug"
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
