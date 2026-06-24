"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import { HookedForm, zEnumKey, zEnumKeyArray, zSlug } from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	SkillData,
	SkillSubType,
	SkillType,
	RoleHierarchy,
	canEditCatalogEntry,
	MagicAttribute,
	LintIgnoredAny,
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

const typeOptions = enumToSelectOptions(SkillType, ["Unknown"]);
const subTypeOptions = enumToSelectOptions(SkillSubType, ["Unknown"]);

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(SkillType, ["Unknown"]),
	subType: zEnumKey(SkillSubType, ["Unknown"]),
	magicAttributes: zEnumKeyArray(MagicAttribute),
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
	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
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
			type: skill.type,
			subType: skill.subType,
			magicAttributes: skill.magicAttributes,
			mana: skill.properties?.components.mana ?? "",
			stamina: skill.properties?.components.stamina ?? "",
			time: skill.properties?.components.time ?? "",
			duration: skill.properties?.components.duration ?? "",
			form: skill.properties?.components.form ?? "",
			range: skill.properties?.components.range ?? "",
			area: skill.properties?.components.area ?? "",
			extras: skill.properties?.extras ?? [],
			summary: skill.info.summary,
			description: skill.info.description,
			miscellaneous: skill.info.miscellaneous,
		},
	});

	if (loading || user == null) return null;
	if (!canEditCatalogEntry(RoleHierarchy[user.role]))
		redirect(`/skills/${skill.slug}`);

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
			},
			magicAttributes: formData.magicAttributes.map(
				(value: LintIgnoredAny) => MagicAttribute[value],
			) as [keyof typeof MagicAttribute],
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/skills/${skill.slug}`),
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
		await revalidateTagByClientSide("/skills");
		await revalidatePathByClientSide("/skills");
		return true;
	}

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/skills",
			name: "Skills",
			icon: getAlbinaApiFullAddress(`/favicon/skills`),
		},
		{
			href: `/skills/${skill.slug}`,
			name: skill.name,
			icon: skill.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${skill.name}]`,
			icon: skill.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title="EDIT"
			isEditable={true}
			banner={skill.bannerUrl}
			icon={skill.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(`/favicon/skills/${skill.slug}`)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/banner/skills/${skill.slug}`,
			)}
			metadataTag={`skill-${skill.slug}`}
			cacheTags={["/skills"]}
			cachePaths={["/skills"]}>
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
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.MultiSelect<FormInput>
							fieldName="magicAttributes"
							options={enumToSelectOptions(MagicAttribute)}
						/>
					}
					colum2={<HookedForm.TextInput<FormInput> fieldName="mana" />}
				/>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={<HookedForm.TextInput<FormInput> fieldName="stamina" />}
					colum2={<HookedForm.TextInput<FormInput> fieldName="time" />}
					colum3={<HookedForm.TextInput<FormInput> fieldName="duration" />}
				/>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={<HookedForm.TextInput<FormInput> fieldName="form" />}
					colum2={<HookedForm.TextInput<FormInput> fieldName="range" />}
					colum3={<HookedForm.TextInput<FormInput> fieldName="area" />}
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
										label="Key"
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
				safetyText={skill.name}
				deletionRoute={getAlbinaApiFullAddress(`/skills/${skill.slug}`)}
				routerPushRoute="/skills"
				revalidateTag="/skills"
			/>

			<UIBasics.Divisor />

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/skills/${skill.slug}`)}
			/>
			<EntityEffectsEditor
				genericEffects={skill.effects}
				targetId={skill.id}
				targetType="Skill"
				defaultEffectName={skill.name}
			/>
		</GenericPageContainer>
	);
}
