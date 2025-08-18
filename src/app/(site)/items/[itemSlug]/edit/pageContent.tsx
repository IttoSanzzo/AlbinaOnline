"use client";

import { GenericModPageContainer } from "@/components/(Design)/components/GenericModPageContainer";
import { UIBasics } from "@/components/(UIBasics)";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import { HookedForm, SelectOption } from "@/libs/stp@forms";
import { ItemData, ItemSubType, ItemType } from "@/libs/stp@types";
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
	rest: z.string(),
});
type FormData = z.infer<typeof schema>;
type FormInputData = z.input<typeof schema>;

interface EditItemPageContentProps {
	item: ItemData;
}
export function EditItemPageContent({ item }: EditItemPageContentProps) {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInputData, any, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: item.name,
			slug: item.slug,
			type: ItemType[item.type].toString(),
			subType: ItemSubType[item.subType].toString(),
			rest: JSON.stringify(
				{
					info: item.info,
					properties: item.properties,
					// effects: item.effects,
				},
				null,
				2
			),
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			...JSON.parse(formData.rest),
		};
		// const response = await authenticatedFetchAsync(
		// 	getAlbinaApiAddress("/items"),
		// 	{
		// 		method: "POST",
		// 		body: JSON.stringify(body),
		// 		headers: { "Content-Type": "application/json" },
		// 	}
		// );
		// if (!response.ok) {
		// 	setError(`Error while creating - ${response.status}`);
		// 	return;
		// }
		// router.push(`/items/${formData.slug}`);
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
				<HookedForm.TextAreaInput<FormData>
					fieldName="rest"
					label="Rest"
					height={1000}
					style={{ fontFamily: "monospace" }}
				/>

				<HookedForm.SubmitButton
					label="Save"
					disabled={!form.formState.isValid || form.formState.isSubmitting}
				/>
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
			<UIBasics.Divisor />
			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.Header
					backgroundColor="blue"
					textAlign="center">
					Effects
				</UIBasics.Header>
				<EntityEffectsEditor
					genericEffects={item.effects}
					targetId={item.id}
					targetType="Item"
				/>
			</UIBasics.Box>
		</GenericModPageContainer>
	);
}
