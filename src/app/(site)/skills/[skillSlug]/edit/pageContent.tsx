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
	SkillData,
	SkillProperties,
	SkillSubType,
	SkillType,
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
const SkillComponentsSchema = z.object({
	mana: z.string(),
	stamina: z.string(),
	time: z.string(),
	duration: z.string(),
	form: z.string(),
	range: z.string(),
	area: z.string(),
});
const SkillPropertiesSchema = z.object({
	components: SkillComponentsSchema,
	extras: z.array(GenericExtraPropertySchema),
});

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(SkillType, ["Unknown"]),
	subType: zEnumKey(SkillSubType, ["Unknown"]),
	info: zJsonStringTyped<GenericInfo>(GenericInfoSchema),
	properties: zJsonStringTyped<SkillProperties>(SkillPropertiesSchema),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditSkillPageContentProps {
	skill: SkillData;
}
export function EditSkillPageContent({ skill }: EditSkillPageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: skill.name,
			slug: skill.slug,
			type: SkillType[skill.type].toString(),
			subType: SkillSubType[skill.subType].toString(),
			info: JSON.stringify(skill.info, null, 2),
			properties: JSON.stringify(skill.properties, null, 2),
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
			getAlbinaApiFullAddress(`/skills/${skill.slug}`),
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
		revalidatePathByClientSide("/skills");
		revalidatePathByClientSide(`/skills/${skill.slug}`);
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(SkillType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(SkillSubType, [
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
			banner={skill.bannerUrl}
			icon={skill.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(`/favicon/skills/${skill.slug}`)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/banner/skills/${skill.slug}`
			)}
			metadataTag={`skill-${skill.slug}`}>
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
				safetyText={skill.name}
				deletionRoute={getAlbinaApiFullAddress(`/skills/${skill.slug}`)}
				routerPushRoute="/skills"
				revalidatePath="/skills"
			/>

			<UIBasics.Divisor />

			<EntityEffectsEditor
				genericEffects={skill.effects}
				targetId={skill.id}
				targetType="Skill"
				revalidatePath={`/skills/${skill.slug}`}
			/>
		</GenericPageContainer>
	);
}
