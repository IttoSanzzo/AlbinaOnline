"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { HookedForm, zEnumKey, zSlug } from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	canEditCatalogEntry,
	LocationData,
	LocationSubType,
	LocationType,
	RoleHierarchy,
	WorldPlane,
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
import { LocationLinksEditor } from "./components/LocationLinksEditor.sub";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(LocationType),
	subType: zEnumKey(LocationSubType),
	worldPlane: zEnumKey(WorldPlane),
	isHidden: z.boolean(),
	climate: z.string(),
	currency: z.string(),
	economy: z.string(),
	government: z.string(),
	population: z.number().min(-1, "Min -1 (undefined)"),
	languages: z.array(z.string()),
	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

const typeOptions = enumToSelectOptions(LocationType, [], undefined, false);
const subTypeOptions = enumToSelectOptions(
	LocationSubType,
	[],
	undefined,
	false,
);
const worldPlaneOptions = enumToSelectOptions(WorldPlane, [], undefined, false);

interface EditLocationPageViewProps {
	location: LocationData;
}
export function EditLocationPageView({ location }: EditLocationPageViewProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: location.name,
			slug: location.slug,
			type: location.type,
			subType: location.subType,
			worldPlane: location.worldPlane,
			climate: location.richInfo?.climate ?? "",
			currency: location.richInfo?.currency ?? "",
			economy: location.richInfo?.economy ?? "",
			government: location.richInfo?.government ?? "",
			languages: location.richInfo?.languages ?? [],
			population: location.richInfo?.population ?? -1,
			isHidden: location.isHidden,
			summary: location.info.summary,
			description: location.info.description,
			miscellaneous: location.info.miscellaneous,
		},
	});

	if (loading || user == null) return null;
	if (!canEditCatalogEntry(RoleHierarchy[user.role]))
		redirect(`/atlas/${location.slug}`);

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			worldPlane: formData.worldPlane,
			isHidden: formData.isHidden,
			richInfo: undefined as unknown,
			info: {
				summary: formData.summary,
				description: formData.description,
				miscellaneous: formData.miscellaneous,
			},
		};
		if (
			formData.climate ||
			formData.currency ||
			formData.economy ||
			formData.government ||
			formData.languages.length != 0 ||
			formData.population != -1
		) {
			body.richInfo = {
				climate: formData.climate != "" ? formData.climate : undefined,
				currency: formData.currency != "" ? formData.currency : undefined,
				economy: formData.economy != "" ? formData.economy : undefined,
				government: formData.government != "" ? formData.government : undefined,
				languages:
					formData.languages.length != 0 ? formData.languages : undefined,
				population: formData.population != -1 ? formData.population : undefined,
			};
		}

		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/atlas/${location.slug}`),
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
		await revalidateTagByClientSide("/atlas");
		await revalidatePathByClientSide("/atlas");
		if (formData.slug != location.slug)
			redirect(`/atlas/${formData.slug}/edit`);
		return true;
	}

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/atlas",
			name: "Atlas",
			icon: getAlbinaApiFullAddress(`/favicon/atlas`),
		},
		{
			href: `/atlas/${location.slug}`,
			name: location.name,
			icon: location.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${location.name}]`,
			icon: location.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title="EDIT"
			isEditable={true}
			banner={location.bannerUrl}
			icon={location.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(
				`/favicon/atlas/${location.slug}`,
			)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/banner/atlas/${location.slug}`,
			)}
			metadataTag={`atlas-${location.slug}`}
			cacheTags={["/atlas"]}
			cachePaths={["/atlas"]}
			subTitle2={
				<StyledFalseLink
					withoutIcon
					title={location.id}
					onClick={async () => {
						await navigator.clipboard.writeText(location.id);
					}}
				/>
			}>
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
				<HookedForm.Select<FormInput>
					fieldName="worldPlane"
					placeholder="Select WorldPlane"
					options={worldPlaneOptions}
				/>

				<HookedForm.BoolInput<FormInput>
					fieldName="isHidden"
					trueBackgroundColor="purple"
					falseBackgroundColor="blue"
				/>

				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
							<HookedForm.TextInput<FormData> fieldName="climate" />
							<HookedForm.TextInput<FormData> fieldName="currency" />
							<HookedForm.TextInput<FormData> fieldName="economy" />
						</div>
					}
					colum2={
						<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
							<HookedForm.TextInput<FormData> fieldName="government" />
							<HookedForm.NumberInput<FormData>
								fieldName="population"
								min={-1}
							/>
							<HookedForm.TextArrayInput<FormData> fieldName="languages" />
						</div>
					}
				/>

				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.TextArrayInput
							fieldName="summary"
							useTextArea
						/>
					}
					colum2={
						<HookedForm.TextArrayInput
							fieldName="description"
							useTextArea
						/>
					}
					colum3={
						<HookedForm.TextArrayInput
							fieldName="miscellaneous"
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
				safetyText={location.name}
				deletionRoute={getAlbinaApiFullAddress(`/atlas/${location.slug}`)}
				routerPushRoute="/atlas"
				revalidateTag="/atlas"
			/>

			<UIBasics.Divisor />
			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/atlas/${location.slug}`)}
			/>
			<UIBasics.Divisor />

			<LocationLinksEditor locationData={location} />
		</GenericPageContainer>
	);
}
