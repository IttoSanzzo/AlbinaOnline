"use client";

import { GenericModPageContainer } from "@/components/(Design)/components/GenericModPageContainer";
import { HookedForm, SelectOption } from "@/libs/stp@forms";
import { ItemSubType, ItemType } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	slug: z.string().min(1, "Min 1 lenght"),
	name: z.string().min(1, "Min 1 lenght"),
	type: z
		.preprocess((type) => Number(type), z.nativeEnum(ItemType))
		.refine((type) => type !== ItemType.Unknown),
	subType: z
		.preprocess((subType) => Number(subType), z.nativeEnum(ItemSubType))
		.refine((subType) => subType !== ItemSubType.Unknown),
});
type FormData = z.infer<typeof schema>;
type FormInputData = z.input<typeof schema>;

export function CreateItemPageContent() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInputData, any, FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress("/items"),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			setError(`Error while creating - ${response.status}`);
			return;
		}
		router.push(`/items/${formData.slug}`);
		setError("");
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(ItemType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(ItemSubType, [
		"Unknown",
	]);

	return (
		<GenericModPageContainer>
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<HookedForm.TextInput
					fieldName="slug"
					label="Slug"
				/>
				<HookedForm.TextInput
					fieldName="name"
					label="Name"
				/>
				<HookedForm.Select
					fieldName="type"
					placeholder="Select Type"
					label="Type"
					options={typeOptions}
				/>
				<HookedForm.Select
					fieldName="subType"
					placeholder="Select SubType"
					label="SubType"
					options={subTypeOptions}
				/>

				<HookedForm.SubmitButton label="Create" />
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
		</GenericModPageContainer>
	);
}
