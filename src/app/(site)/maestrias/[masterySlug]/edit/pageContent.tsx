"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
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
	canEditCatalogEntry,
	GenericInfo,
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
	type: zEnumKey(MasteryType, ["Unknown"]),
	subType: zEnumKey(MasterySubType, ["Unknown"]),
	info: zJsonStringTyped<GenericInfo>(GenericInfoSchema),
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
			type: MasteryType[mastery.type].toString(),
			subType: MasterySubType[mastery.subType].toString(),
			info: JSON.stringify(mastery.info, null, 2),
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
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(MasteryType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(MasterySubType, [
		"Unknown",
	]);

	if (loading || user == null || !canEditCatalogEntry(RoleHierarchy[user.role]))
		return null;

	return (
		<GenericPageContainer
			title=""
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
				safetyText={mastery.name}
				deletionRoute={getAlbinaApiFullAddress(`/masteries/${mastery.slug}`)}
				routerPushRoute="/maestrias"
				revalidateTag="/masteries"
			/>

			<UIBasics.Divisor />

			<EntityEffectsEditor
				genericEffects={mastery.effects}
				targetId={mastery.id}
				targetType="Mastery"
			/>

			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/masteries/${mastery.slug}`)}
			/>
		</GenericPageContainer>
	);
}
