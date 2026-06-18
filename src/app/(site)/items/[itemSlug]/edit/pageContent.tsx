"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import { HookedForm, zEnumKey, zEnumKeyArray, zSlug } from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	canEditCatalogEntry,
	EquipmentSlotType,
	ItemData,
	ItemSlotTypeName,
	ItemSubType,
	ItemType,
	MagicAttribute,
	RoleHierarchy,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(ItemType),
	subType: zEnumKey(ItemSubType),
	weight: z.number(),
	compatibleSlots: zEnumKeyArray(EquipmentSlotType),
	magicAttributes: zEnumKeyArray(MagicAttribute),
	damage: z.string(),
	accuracy: z.string(),
	defense: z.string(),
	damageType: z.string(),
	range: z.string(),
	extras: z.array(
		z.object({
			key: z.string(),
			value: z.string(),
		}),
	),
	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

const typeOptions = enumToSelectOptions(ItemType);
const subTypeOptions = enumToSelectOptions(ItemSubType);
const compatibleSlotOptions = enumToSelectOptions(EquipmentSlotType).map(
	(option) => ({
		...option,
		name: ItemSlotTypeName[option.name as keyof typeof EquipmentSlotType],
	}),
);
const magicAttributeOptions = enumToSelectOptions(MagicAttribute);

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
			type: item.type,
			subType: item.subType,
			weight: item.properties.weight,
			compatibleSlots: item.properties.compatibleSlots,
			magicAttributes: item.properties.magicAttributes,
			damage: item.properties.stats?.damage ?? "",
			accuracy: item.properties.stats?.accuracy ?? "",
			defense: item.properties.stats?.defense ?? "",
			damageType: item.properties.stats?.damageType ?? "",
			range: item.properties.stats?.range ?? "",
			extras: item.properties.extras,
			summary: item.info.summary,
			description: item.info.description,
			miscellaneous: item.info.miscellaneous,
		},
	});

	if (loading || user == null) return null;
	if (!canEditCatalogEntry(RoleHierarchy[user.role]))
		redirect(`/items/${item.slug}`);

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			properties: {
				stats: undefined as unknown,
				extras: formData.extras,
				weight: formData.weight,
				compatibleSlots: formData.compatibleSlots,
				magicAttributes: formData.magicAttributes,
			},
			info: {
				summary: formData.summary,
				description: formData.description,
				miscellaneous: formData.miscellaneous,
			},
		};
		if (
			formData.damage != "" ||
			formData.accuracy != "" ||
			formData.defense != "" ||
			formData.damageType != "" ||
			formData.range != ""
		) {
			body.properties.stats = {
				damage: formData.damage,
				accuracy: formData.accuracy,
				defense: formData.defense,
				damageType: formData.damageType,
				range: formData.range,
			};
		}

		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/items/${item.slug}`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			},
		);
		if (!response.ok) {
			toast.error("Save failed", { id: toastId });
			setError(`Error while saving - ${response.status}`);
			return;
		}
		setError("");
		toast.success("Saved", { id: toastId });
		await revalidateTagByClientSide("/items");
		await revalidatePathByClientSide("/items");
		return true;
	}

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/items",
			name: "Items",
			icon: getAlbinaApiFullAddress(`/favicon/items`),
		},
		{
			href: `/items/${item.slug}`,
			name: item.name,
			icon: item.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${item.name}]`,
			icon: item.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title="EDIT"
			isEditable={true}
			banner={item.bannerUrl}
			icon={item.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(`/favicon/items/${item.slug}`)}
			bannerChangeRoute={getAlbinaApiFullAddress(`/banner/items/${item.slug}`)}
			metadataTag={`item-${item.slug}`}
			cacheTags={["/items"]}
			cachePaths={["/items"]}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={<HookedForm.TextInput<FormInput> fieldName="name" />}
					colum2={<HookedForm.TextInput<FormInput> fieldName="slug" />}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.Select<FormInput>
							fieldName="type"
							placeholder="Select Type"
							options={typeOptions}
						/>
					}
					colum2={
						<HookedForm.Select<FormInput>
							fieldName="subType"
							placeholder="Select SubType"
							options={subTypeOptions}
						/>
					}
				/>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.MultiSelect<FormInput>
							fieldName="compatibleSlots"
							options={compatibleSlotOptions}
						/>
					}
					colum2={
						<HookedForm.MultiSelect<FormInput>
							fieldName="magicAttributes"
							options={magicAttributeOptions}
						/>
					}
					colum3={
						<HookedForm.NumberInput<FormInput>
							fieldName="weight"
							label="Weight (Grams)"
							style={{ fontFamily: "monospace" }}
							min={0}
							max={2147483647}
							width={"100%"}
						/>
					}
				/>

				<UIBasics.MultiColumn.Two
					colum1={<HookedForm.TextInput<FormInput> fieldName="damage" />}
					colum2={<HookedForm.TextInput<FormInput> fieldName="damageType" />}
				/>
				<UIBasics.MultiColumn.Three
					colum1={<HookedForm.TextInput<FormInput> fieldName="accuracy" />}
					colum2={<HookedForm.TextInput<FormInput> fieldName="defense" />}
					colum3={<HookedForm.TextInput<FormInput> fieldName="range" />}
				/>

				<HookedForm.ObjectArrayInput
					fieldName="extras"
					defaultObject={{ key: "", value: "" }}
					style={{ fontFamily: "monospace" }}
					childrenGenerator={({ index, lastRef }) => {
						return (
							<UIBasics.MultiColumn.Two
								divisionRatio={-3}
								colum1={
									<HookedForm.ObjectArrayTextInput<FormInput>
										fieldName="extras"
										objectKey="key"
										index={index}
										ref={lastRef}
									/>
								}
								colum2={
									<HookedForm.ObjectArrayTextInput<FormInput>
										fieldName="extras"
										objectKey="value"
										index={index}
									/>
								}
							/>
						);
					}}
				/>

				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.TextArrayInput
							fieldName="summary"
							width={"99%"}
							useTextArea
						/>
					}
					colum2={
						<HookedForm.TextArrayInput
							fieldName="description"
							width={"99%"}
							useTextArea
						/>
					}
					colum3={
						<HookedForm.TextArrayInput
							fieldName="miscellaneous"
							width={"99%"}
							useTextArea
						/>
					}
				/>

				<HookedForm.Space />
				<HookedForm.SubmitButton label="Save" />
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
			<HookedForm.Space height={2} />
			<DeletionAlertDialog
				safetyText={item.name}
				deletionRoute={getAlbinaApiFullAddress(`/items/${item.slug}`)}
				routerPushRoute="/items"
				revalidateTag="/items"
			/>

			<UIBasics.Divisor />

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/items/${item.slug}`)}
			/>
			<EntityEffectsEditor
				genericEffects={item.effects}
				targetId={item.id}
				targetType="Item"
			/>
		</GenericPageContainer>
	);
}
