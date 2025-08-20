"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import {
	HookedForm,
	SelectOption,
	zEnumKey,
	zEnumKeyArrayString,
	zJsonStringTyped,
	zSlug,
} from "@/libs/stp@forms";
import { useCurrentUser } from "@/libs/stp@hooks";
import {
	GenericInfo,
	SpellData,
	SpellProperties,
	SpellSubType,
	SpellType,
	RoleHierarchy,
	SpellDomain,
	MagicAttribute,
} from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
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
const SpellComponentsSchema = z.object({
	mana: z.string(),
	stamina: z.string(),
	time: z.string(),
	duration: z.string(),
	form: z.string(),
	range: z.string(),
	area: z.string(),
});
const SpellPropertiesSchema = z.object({
	components: SpellComponentsSchema,
	chants: z.array(z.string()),
	extras: z.array(GenericExtraPropertySchema),
});

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(SpellType, []),
	subType: zEnumKey(SpellSubType, []),
	info: zJsonStringTyped<GenericInfo>(GenericInfoSchema),
	properties: zJsonStringTyped<SpellProperties>(SpellPropertiesSchema),
	domainLevel: z.number().min(0, "Min 0"),
	spellDomains: zEnumKeyArrayString(SpellDomain, ["Unknown"]),
	magicAttributes: zEnumKeyArrayString(MagicAttribute, ["Unknown"]),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditSpellPageContentProps {
	spell: SpellData;
}
export function EditSpellPageContent({ spell }: EditSpellPageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, any, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: spell.name,
			slug: spell.slug,
			type: SpellType[spell.type].toString(),
			subType: SpellSubType[spell.subType].toString(),
			info: JSON.stringify(spell.info, null, 2),
			properties: JSON.stringify(spell.properties, null, 2),
			domainLevel: spell.domainLevel,
			spellDomains: JSON.stringify(spell.spellDomains),
			magicAttributes: JSON.stringify(spell.magicAttributes),
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
			domainLevel: formData.domainLevel,
			spellDomains: formData.spellDomains,
			magicAttributes: formData.magicAttributes,
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/spells/${spell.slug}`),
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
		revalidatePathByClientSide("/spells");
		revalidatePathByClientSide(`/spells/${spell.slug}`);
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(SpellType, []);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(SpellSubType, []);

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
			banner={spell.bannerUrl}
			icon={spell.iconUrl}
			iconChangeRoute={getAlbinaApiAddress(`/favicon/spells/${spell.slug}`)}
			bannerChangeRoute={getAlbinaApiAddress(`/banner/spells/${spell.slug}`)}
			metadataTag={`spell-${spell.slug}`}>
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
				<HookedForm.NumberInput<FormInput>
					fieldName="domainLevel"
					label="Domain Level"
					min={0}
				/>
				<HookedForm.TextAreaInput<FormInput>
					fieldName="spellDomains"
					label="Spell Domains"
					height={300}
					style={{ fontFamily: "monospace" }}
				/>
				<HookedForm.TextAreaInput<FormInput>
					fieldName="magicAttributes"
					label="Magic Attributes"
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
				safetyText={spell.name}
				deletionRoute={getAlbinaApiAddress(`/spells/${spell.slug}`)}
				routerPushRoute="/spells"
				revalidatePath="/spells"
			/>

			<UIBasics.Divisor />

			<EntityEffectsEditor
				genericEffects={spell.effects}
				targetId={spell.id}
				targetType="Spell"
				revalidatePath={`/spells/${spell.slug}`}
			/>
		</GenericPageContainer>
	);
}
