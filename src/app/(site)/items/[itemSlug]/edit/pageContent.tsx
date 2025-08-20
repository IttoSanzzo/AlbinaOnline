"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { EntityEffectsEditor } from "@/components/(UTILS)/components/EntityEffectsEditor";
import { HookedForm, SelectOption, zSlug } from "@/libs/stp@forms";
import { useCurrentUser } from "@/libs/stp@hooks";
import {
	ItemData,
	ItemSubType,
	ItemType,
	RoleHierarchy,
} from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: z
		.preprocess((type) => Number(type), z.nativeEnum(ItemType))
		.refine((type) => type !== ItemType.Unknown),
	subType: z
		.preprocess((subType) => Number(subType), z.nativeEnum(ItemSubType))
		.refine((subType) => subType !== ItemSubType.Unknown),
	rest: z.string(),
});
type FormData = z.infer<typeof schema>;
type FormInputData = z.input<typeof schema>;

interface EditItemPageContentProps {
	item: ItemData;
}
export function EditItemPageContent({ item }: EditItemPageContentProps) {
	const { user, loading } = useCurrentUser();
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInputData, any, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: item.name,
			slug: item.slug,
			type: ItemType[item.type].toString(),
			subType: ItemSubType[item.subType].toString(),
			rest: JSON.stringify(
				{
					info: item.info,
					properties: item.properties,
				},
				null,
				2
			),
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			...JSON.parse(formData.rest),
		};
		console.log(body);
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/items/${item.slug}`),
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
		revalidatePathByClientSide(`/items/${item.slug}`);
		// router.push(`/items/${formData.slug}`);
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(ItemType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(ItemSubType, [
		"Unknown",
	]);

	useEffect(() => {
		if (
			!loading &&
			user != null &&
			RoleHierarchy[user.role] <= RoleHierarchy.Admin
		)
			router.push(`/items/${item.slug}`);
	}, [user]);
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
			iconChangeRoute={getAlbinaApiAddress(`/favicon/items/${item.slug}`)}
			bannerChangeRoute={getAlbinaApiAddress(`/banner/items/${item.slug}`)}
			metadataTag={`item-${item.slug}`}>
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<HookedForm.TextInput<FormData>
					fieldName="slug"
					label="Slug"
				/>
				<HookedForm.TextInput<FormData>
					fieldName="name"
					label="Name"
				/>
				<HookedForm.Select<FormData>
					fieldName="type"
					placeholder="Select Type"
					label="Type"
					options={typeOptions}
				/>
				<HookedForm.Select<FormData>
					fieldName="subType"
					placeholder="Select SubType"
					label="SubType"
					options={subTypeOptions}
				/>
				<HookedForm.TextAreaInput<FormData>
					fieldName="rest"
					label="Rest"
					height={1000}
					style={{ fontFamily: "monospace" }}
				/>

				<HookedForm.SubmitButton
					label="Save"
					disabled={!form.formState.isValid || form.formState.isSubmitting}
				/>
				<HookedForm.SimpleMessage
					message={error}
					color="red"
				/>
			</HookedForm.Form>
			<HookedForm.Space />
			<DeletionAlertDialog
				safetyText={item.name}
				deletionRoute={getAlbinaApiAddress(`/items/${item.slug}`)}
				routerPushRoute="/items"
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
