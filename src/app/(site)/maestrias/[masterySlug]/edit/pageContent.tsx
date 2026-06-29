"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import { HookedForm, zEnumKey, zSlug } from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	canEditCatalogEntry,
	MasteryData,
	MasterySubType,
	MasteryType,
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

const typeOptions = enumToSelectOptions(MasteryType, ["Unknown"]);
const subTypeOptions = enumToSelectOptions(MasterySubType, ["Unknown"]);

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(MasteryType, ["Unknown"]),
	subType: zEnumKey(MasterySubType, ["Unknown"]),
	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditMasteryPageContentProps {
	mastery: MasteryData;
}
export function EditMasteryPageContent({
	mastery,
}: EditMasteryPageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: mastery.name,
			slug: mastery.slug,
			type: mastery.type,
			subType: mastery.subType,
			summary: mastery.info.summary,
			description: mastery.info.description,
			miscellaneous: mastery.info.miscellaneous,
		},
	});

	if (loading || user == null) return null;
	if (!canEditCatalogEntry(RoleHierarchy[user.role]))
		redirect(`/maestrias/${mastery.slug}`);

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
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/masteries/${mastery.slug}`),
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
		await revalidateTagByClientSide("/masteries");
		await revalidatePathByClientSide("/maestrias");
		if (formData.slug != mastery.slug)
			redirect(`/maestrias/${formData.slug}/edit`);
		return true;
	}

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/maestrias",
			name: "Maestrias",
			icon: getAlbinaApiFullAddress(`/favicon/masteries`),
		},
		{
			href: `/maestrias/${mastery.slug}`,
			name: mastery.name,
			icon: mastery.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${mastery.name}]`,
			icon: mastery.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title="EDIT"
			isEditable={true}
			banner={mastery.bannerUrl}
			icon={mastery.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(
				`/favicon/masteries/${mastery.slug}`,
			)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/banner/masteries/${mastery.slug}`,
			)}
			metadataTag={`mastery-${mastery.slug}`}
			cacheTags={["/masteries"]}
			cachePaths={["/maestrias"]}>
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
				safetyText={mastery.name}
				deletionRoute={getAlbinaApiFullAddress(`/masteries/${mastery.slug}`)}
				routerPushRoute="/maestrias"
				revalidateTag="/masteries"
			/>

			<UIBasics.Divisor />

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/masteries/${mastery.slug}`)}
			/>
			<EntityEffectsEditor
				genericEffects={mastery.effects}
				targetId={mastery.id}
				targetType="Mastery"
				defaultEffectName={mastery.name}
			/>
		</GenericPageContainer>
	);
}
