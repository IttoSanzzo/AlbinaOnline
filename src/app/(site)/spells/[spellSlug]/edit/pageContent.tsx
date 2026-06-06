"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import { HookedForm, SelectOption, zEnumKey, zSlug } from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	SpellData,
	SpellSubType,
	SpellType,
	RoleHierarchy,
	SpellDomain,
	MagicAttribute,
	canEditCatalogEntry,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions, enumToSelectStringOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(SpellType, []),
	subType: zEnumKey(SpellSubType, []),
	domainLevel: z.number().min(0, "Min 0").max(12, "Max 12"),
	spellDomains: z.array(z.string()),
	magicAttributes: z.array(z.string()),
	mana: z.string().optional(),
	stamina: z.string().optional(),
	time: z.string().optional(),
	duration: z.string().optional(),
	form: z.string().optional(),
	range: z.string().optional(),
	area: z.string().optional(),
	extras: z.array(
		z.object({
			key: z.string(),
			value: z.string(),
		}),
	),
	chants: z.array(z.string()),
	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditSpellPageContentProps {
	spell: SpellData;
}
export function EditSpellPageContent({ spell }: EditSpellPageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			name: spell.name,
			slug: spell.slug,
			type: SpellType[spell.type].toString(),
			subType: SpellSubType[spell.subType].toString(),
			spellDomains: spell.spellDomains,
			domainLevel: spell.domainLevel,
			magicAttributes: spell.magicAttributes,
			mana: spell.properties?.components.mana ?? "",
			stamina: spell.properties?.components.stamina ?? "",
			time: spell.properties?.components.time ?? "",
			duration: spell.properties?.components.duration ?? "",
			form: spell.properties?.components.form ?? "",
			range: spell.properties?.components.range ?? "",
			area: spell.properties?.components.area ?? "",
			extras: spell.properties?.extras ?? [],
			chants: spell.properties?.chants ?? [],
			summary: spell.info.summary,
			description: spell.info.description,
			miscellaneous: spell.info.miscellaneous,
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			info: {
				summary: formData.summary,
				description: formData.description,
				miscellaneous: formData.miscellaneous,
			},
			properties: {
				extras: formData.extras,
				components: {
					mana: formData.mana,
					stamina: formData.stamina,
					time: formData.time,
					duration: formData.duration,
					form: formData.form,
					range: formData.range,
					area: formData.area,
				},
				chants: formData.chants,
			},
			domainLevel: formData.domainLevel,
			spellDomains:
				formData.spellDomains.length == 0 ? ["Unknown"] : formData.spellDomains,
			magicAttributes:
				formData.magicAttributes.length == 0
					? ["Unknown"]
					: formData.magicAttributes,
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/spells/${spell.slug}`),
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
		await revalidateTagByClientSide("/spells");
		await revalidatePathByClientSide("/spells");
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(SpellType, []);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(SpellSubType, []);

	if (loading || user == null || !canEditCatalogEntry(RoleHierarchy[user.role]))
		return null;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/spells",
			name: "Spells",
			icon: getAlbinaApiFullAddress(`/favicon/spells`),
		},
		{
			href: `/spells/${spell.slug}`,
			name: spell.name,
			icon: spell.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${spell.name}]`,
			icon: spell.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title=""
			isEditable={true}
			banner={spell.bannerUrl}
			icon={spell.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(`/favicon/spells/${spell.slug}`)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/banner/spells/${spell.slug}`,
			)}
			metadataTag={`spell-${spell.slug}`}
			cacheTags={["/spells"]}
			cachePaths={["/spells"]}>
			<SetBreadcrumbs breadcrumbs={breadcrumbs} />
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.TextInput<FormInput>
							fieldName="name"
							label="Name"
						/>
					}
					colum2={
						<HookedForm.TextInput<FormInput>
							fieldName="slug"
							label="Slug"
						/>
					}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.Select<FormInput>
							fieldName="type"
							placeholder="Select Type"
							label="Type"
							options={typeOptions}
						/>
					}
					colum2={
						<HookedForm.Select<FormInput>
							fieldName="subType"
							placeholder="Select SubType"
							label="SubType"
							options={subTypeOptions}
						/>
					}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.MultiSelect<FormInput>
							fieldName="spellDomains"
							label="Spell Domains"
							options={enumToSelectStringOptions(SpellDomain)}
						/>
					}
					colum2={
						<HookedForm.NumberInput<FormInput>
							fieldName="domainLevel"
							label="Domain Level"
							min={0}
							max={12}
						/>
					}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.MultiSelect<FormInput>
							fieldName="magicAttributes"
							label="Magic Attributes"
							options={enumToSelectStringOptions(MagicAttribute)}
						/>
					}
					colum2={
						<HookedForm.TextInput<FormInput>
							fieldName="mana"
							label="Mana"
						/>
					}
				/>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.TextInput<FormInput>
							fieldName="stamina"
							label="Stamina"
						/>
					}
					colum2={
						<HookedForm.TextInput<FormInput>
							fieldName="time"
							label="Time"
						/>
					}
					colum3={
						<HookedForm.TextInput<FormInput>
							fieldName="duration"
							label="Duration"
						/>
					}
				/>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.TextInput<FormInput>
							fieldName="form"
							label="Form"
						/>
					}
					colum2={
						<HookedForm.TextInput<FormInput>
							fieldName="range"
							label="Range"
						/>
					}
					colum3={
						<HookedForm.TextInput<FormInput>
							fieldName="area"
							label="Area"
						/>
					}
				/>

				<HookedForm.ObjectArrayInput
					fieldName="extras"
					label="Extras"
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
										label="Key"
										index={index}
										ref={lastRef}
									/>
								}
								colum2={
									<HookedForm.ObjectArrayTextInput<FormInput>
										fieldName="extras"
										objectKey="value"
										label="Key"
										index={index}
									/>
								}
							/>
						);
					}}
				/>
				<HookedForm.TextArrayInput<FormInput>
					fieldName="chants"
					label="Chants"
				/>

				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.TextArrayInput
							label="Summary"
							fieldName="summary"
							width={"99%"}
							useTextArea
						/>
					}
					colum2={
						<HookedForm.TextArrayInput
							label="Description"
							fieldName="description"
							width={"99%"}
							useTextArea
						/>
					}
					colum3={
						<HookedForm.TextArrayInput
							label="Miscellaneous"
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
				safetyText={spell.name}
				deletionRoute={getAlbinaApiFullAddress(`/spells/${spell.slug}`)}
				routerPushRoute="/spells"
				revalidateTag="/spells"
			/>

			<UIBasics.Divisor />

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/spells/${spell.slug}`)}
			/>
			<EntityEffectsEditor
				genericEffects={spell.effects}
				targetId={spell.id}
				targetType="Spell"
			/>
		</GenericPageContainer>
	);
}
