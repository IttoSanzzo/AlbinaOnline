"use client";

import { HookedForm, SelectOption, zEnumKey, zSlug } from "@/libs/stp@forms";
import { LintIgnoredAny, MasterySubType, MasteryType } from "@/libs/stp@types";
import { enumToSelectOptions } from "@/utils/Data";
import { UseFormReturn } from "react-hook-form";

import { z } from "zod";

export const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(MasteryType, ["Unknown"]),
	subType: zEnumKey(MasterySubType, ["Unknown"]),
});
type FormData = z.infer<typeof schema>;

const typeOptions = enumToSelectOptions(MasteryType, ["Unknown"]);

interface CreationFormProps {
	form: UseFormReturn<LintIgnoredAny, unknown, LintIgnoredAny>;
}
export function CreationForm({ form }: CreationFormProps) {
	void form;

	let subTypesFromThisType: string[] = [];
	switch (form.watch().type) {
		case "Proficiency":
			subTypesFromThisType = [
				"Strength",
				"Agility",
				"Technique",
				"Constitution",
				"Intelligence",
				"Wisdom",
				"Charisma",
			];
			break;
		case "Expertise":
			subTypesFromThisType = ["Singular", "Multiple"];
			break;
		case "Knowledge":
			subTypesFromThisType = ["Combatant", "Production", "General"];
			break;
		case "Craft":
			subTypesFromThisType = [
				"Armed",
				"Focus",
				"Armored",
				"CombatStyle",
				"Tool",
			];
			break;
		default:
			break;
	}
	const subTypeOptions: SelectOption[] = subTypesFromThisType.map(
		(subType) => ({ value: subType, name: subType }),
	);

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
				placeholder={`${subTypeOptions.length > 0 ? "Select SubType" : "Select a type first"}`}
				label="SubType"
				options={subTypeOptions}
				disabled={subTypeOptions.length == 0}
			/>
		</>
	);
}
