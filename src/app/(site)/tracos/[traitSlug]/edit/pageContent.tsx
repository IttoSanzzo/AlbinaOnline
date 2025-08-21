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
	TraitData,
	TraitSubType,
	TraitType,
	RoleHierarchy,
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

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(TraitType, ["Unknown"]),
	subType: zEnumKey(TraitSubType, []),
	info: zJsonStringTyped<GenericInfo>(GenericInfoSchema),
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
			info: JSON.stringify(trait.info, null, 2),
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			info: formData.info,
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/traits/${trait.slug}`),
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
		revalidatePathByClientSide("/tracos");
		revalidatePathByClientSide(`/tracos/${trait.slug}`);
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(TraitType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(TraitSubType, []);

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
			banner={trait.bannerUrl}
			icon={trait.iconUrl}
			iconChangeRoute={getAlbinaApiAddress(`/favicon/traits/${trait.slug}`)}
			bannerChangeRoute={getAlbinaApiAddress(`/banner/traits/${trait.slug}`)}
			metadataTag={`trait-${trait.slug}`}>
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

				<HookedForm.SubmitButton label="Save" />
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
			<HookedForm.Space />
			<DeletionAlertDialog
				safetyText={trait.name}
				deletionRoute={getAlbinaApiAddress(`/traits/${trait.slug}`)}
				routerPushRoute="/tracos"
				revalidatePath="/tracos"
			/>

			<UIBasics.Divisor />

			<EntityEffectsEditor
				genericEffects={trait.effects}
				targetId={trait.id}
				targetType="Trait"
				revalidatePath={`/tracos/${trait.slug}`}
			/>
		</GenericPageContainer>
	);
}
