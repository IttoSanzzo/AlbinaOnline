"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import { HookedForm, SelectOption, zEnumKey, zSlug } from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	TraitData,
	TraitSubType,
	TraitType,
	RoleHierarchy,
	canEditCatalogEntry,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions } from "@/utils/Data";
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

const typeOptions: SelectOption[] = enumToSelectOptions(TraitType, ["Unknown"]);
const subTypeOptions: SelectOption[] = enumToSelectOptions(TraitSubType, [
	"Unknown",
]);

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(TraitType, []),
	subType: zEnumKey(TraitSubType, []),
	requirements: z.array(
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

interface EditTraitPageContentProps {
	trait: TraitData;
}
export function EditTraitPageContent({ trait }: EditTraitPageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: trait.name,
			slug: trait.slug,
			type: TraitType[trait.type].toString(),
			subType: TraitSubType[trait.subType].toString(),
			requirements: trait.properties.requirements,
			summary: trait.info.summary,
			description: trait.info.description,
			miscellaneous: trait.info.miscellaneous,
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			properties: {
				requirements: formData.requirements,
			},
			info: {
				summary: formData.summary,
				description: formData.description,
				miscellaneous: formData.miscellaneous,
			},
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/traits/${trait.slug}`),
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
		await revalidateTagByClientSide("/traits");
		await revalidatePathByClientSide("/tracos");
	}

	if (loading || user == null || !canEditCatalogEntry(RoleHierarchy[user.role]))
		return null;

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/tracos",
			name: "Traços",
			icon: getAlbinaApiFullAddress(`/favicon/traits`),
		},
		{
			href: `/tracos/${trait.slug}`,
			name: trait.name,
			icon: trait.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${trait.name}]`,
			icon: trait.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title=""
			isEditable={true}
			banner={trait.bannerUrl}
			icon={trait.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(`/favicon/traits/${trait.slug}`)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/banner/traits/${trait.slug}`,
			)}
			metadataTag={`trait-${trait.slug}`}
			cacheTags={["/traits"]}
			cachePaths={["/tracos"]}>
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
				<HookedForm.ObjectArrayInput
					fieldName="requirements"
					defaultObject={{ key: "", value: "" }}
					style={{ fontFamily: "monospace" }}
					childrenGenerator={({ index, lastRef }) => {
						return (
							<UIBasics.MultiColumn.Two
								divisionRatio={-3}
								colum1={
									<HookedForm.ObjectArrayTextInput<FormInput>
										fieldName="requirements"
										objectKey="key"
										index={index}
										ref={lastRef}
									/>
								}
								colum2={
									<HookedForm.ObjectArrayTextInput<FormInput>
										fieldName="requirements"
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
				safetyText={trait.name}
				deletionRoute={getAlbinaApiFullAddress(`/traits/${trait.slug}`)}
				routerPushRoute="/tracos"
				revalidateTag="/traits"
			/>

			<UIBasics.Divisor />

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/traits/${trait.slug}`)}
			/>
			<EntityEffectsEditor
				genericEffects={trait.effects}
				targetId={trait.id}
				targetType="Trait"
			/>
		</GenericPageContainer>
	);
}
