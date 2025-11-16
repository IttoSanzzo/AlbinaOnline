"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import {
	HookedForm,
	SelectOption,
	zEnumKey,
	zJsonStringTyped,
	zSlug,
} from "@/libs/stp@forms";
import { useCurrentUser } from "@/libs/stp@hooks";
import {
	GenericInfo,
	ItemData,
	ItemProperties,
	ItemSubType,
	ItemType,
	RoleHierarchy,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const GenericInfoSchema = z.object({
	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
});
const GenericExtraPropertySchema = z.object({
	key: z.string(),
	value: z.string(),
});
const ItemStatsSchema = z.object({
	damage: z.string(),
	accuracy: z.string(),
	defense: z.string(),
	damageType: z.string(),
	range: z.string(),
});
const ItemPropertiesSchema = z.object({
	compatibleSlots: z.array(z.string()),
	weight: z.number(),
	magicAttributes: z.array(z.string()),
	stats: ItemStatsSchema.nullable(),
	extras: z.array(GenericExtraPropertySchema),
});

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(ItemType, ["Unknown"]),
	subType: zEnumKey(ItemSubType, ["Unknown"]),
	info: zJsonStringTyped<GenericInfo>(GenericInfoSchema),
	properties: zJsonStringTyped<ItemProperties>(ItemPropertiesSchema),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditItemPageContentProps {
	item: ItemData;
}
export function EditItemPageContent({ item }: EditItemPageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: item.name,
			slug: item.slug,
			type: ItemType[item.type].toString(),
			subType: ItemSubType[item.subType].toString(),
			info: JSON.stringify(item.info, null, 2),
			properties: JSON.stringify(item.properties, null, 2),
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			info: formData.info,
			properties: formData.properties,
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/items/${item.slug}`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			toast.error("Save failed", { id: toastId });
			setError(`Error while saving - ${response.status}`);
			return;
		}
		setError("");
		toast.success("Saved", { id: toastId });
		revalidatePathByClientSide("/items");
		revalidatePathByClientSide(`/items/${item.slug}`);
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(ItemType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(ItemSubType, [
		"Unknown",
	]);

	if (
		loading ||
		user == null ||
		RoleHierarchy[user.role] <= RoleHierarchy.Admin
	)
		return null;

	return (
		<GenericPageContainer
			title=""
			isEditable={true}
			banner={item.bannerUrl}
			icon={item.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(`/favicon/items/${item.slug}`)}
			bannerChangeRoute={getAlbinaApiFullAddress(`/banner/items/${item.slug}`)}
			metadataTag={`item-${item.slug}`}>
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<HookedForm.TextInput<FormInput>
					fieldName="slug"
					label="Slug"
				/>
				<HookedForm.TextInput<FormInput>
					fieldName="name"
					label="Name"
				/>
				<HookedForm.Select<FormInput>
					fieldName="type"
					placeholder="Select Type"
					label="Type"
					options={typeOptions}
				/>
				<HookedForm.Select<FormInput>
					fieldName="subType"
					placeholder="Select SubType"
					label="SubType"
					options={subTypeOptions}
				/>
				<HookedForm.TextAreaInput<FormInput>
					fieldName="info"
					label="Info"
					height={200}
					style={{ fontFamily: "monospace" }}
				/>
				<HookedForm.TextAreaInput<FormInput>
					fieldName="properties"
					label="Properties"
					height={300}
					style={{ fontFamily: "monospace" }}
				/>

				<HookedForm.SubmitButton label="Save" />
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
			<HookedForm.Space />
			<DeletionAlertDialog
				safetyText={item.name}
				deletionRoute={getAlbinaApiFullAddress(`/items/${item.slug}`)}
				routerPushRoute="/items"
				revalidatePath="/items"
			/>

			<UIBasics.Divisor />

			<EntityEffectsEditor
				genericEffects={item.effects}
				targetId={item.id}
				targetType="Item"
				revalidatePath={`/items/${item.slug}`}
			/>
		</GenericPageContainer>
	);
}
