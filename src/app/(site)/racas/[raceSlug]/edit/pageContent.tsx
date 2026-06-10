"use client";

import { GenericPageContainer } from "@/components/(Design)";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import { HookedForm, SelectOption, zEnumKey, zSlug } from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	canEditCatalogEntry,
	LanguageType,
	RaceData,
	RaceSubType,
	RaceType,
	RoleHierarchy,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions, enumToSelectStringOptions } from "@/utils/Data";
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

const typeOptions: SelectOption[] = enumToSelectOptions(RaceType, ["Unknown"]);
const subTypeOptions: SelectOption[] = enumToSelectOptions(RaceSubType, [
	"Unknown",
]);

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(RaceType, ["Unknown"]),
	subType: zEnumKey(RaceSubType, ["Unknown"]),
	introduction: z.array(z.string()),
	personality: z.array(z.string()),
	culture: z.array(z.string()),
	miscellaneous: z.array(z.string()),
	groups: z.array(z.string()),
	relations: z.array(z.string()),
	description: z.array(z.string()),
	vitality: z.number().min(1, "Min 1").max(4, "Max 4"),
	vigor: z.number().min(1, "Min 1").max(4, "Max 4"),
	manapool: z.number().min(1, "Min 1").max(4, "Max 4"),
	physicalPower: z.number().min(1, "Min 1").max(4, "Max 4"),
	magicalPower: z.number().min(1, "Min 1").max(4, "Max 4"),
	height: z.string(),
	weight: z.string(),
	longevity: z.string(),
	speed: z.string(),
	language: zEnumKey(LanguageType, []),
	skillSlugs: z.array(z.string()),
	traitSlugs: z.array(z.string()),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditRacePageContentProps {
	race: RaceData;
}
export function EditRacePageContent({ race }: EditRacePageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: race.name,
			slug: race.slug,
			type: RaceType[race.type].toString(),
			subType: RaceSubType[race.subType].toString(),
			introduction: race.info.introduction,
			personality: race.info.personality,
			culture: race.info.culture,
			miscellaneous: race.info.miscellaneous,
			groups: race.info.groups,
			relations: race.info.relations,
			description: race.info.description,
			vitality: race.parameters.vitality,
			vigor: race.parameters.vigor,
			manapool: race.parameters.manapool,
			physicalPower: race.parameters.physicalPower,
			magicalPower: race.parameters.magicalPower,
			height: race.generals.height,
			weight: race.generals.weight,
			longevity: race.generals.longevity,
			speed: race.generals.speed,
			language: race.generals.language,
			skillSlugs: race.skillSlugs,
			traitSlugs: race.traitSlugs,
		},
	});

	if (loading || user == null) return null;
	if (!canEditCatalogEntry(RoleHierarchy[user.role]))
		redirect(`/racas/${race.slug}`);

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			info: {
				introduction: formData.introduction,
				personality: formData.personality,
				culture: formData.culture,
				miscellaneous: formData.miscellaneous,
				groups: formData.groups,
				relations: formData.relations,
				description: formData.description,
				images: [],
			},
			parameters: {
				vitality: formData.vitality,
				vigor: formData.vigor,
				manapool: formData.manapool,
				physicalPower: formData.physicalPower,
				magicalPower: formData.magicalPower,
			},
			generals: {
				height: formData.height,
				weight: formData.weight,
				longevity: formData.longevity,
				speed: formData.speed,
				language: formData.language,
			},
			skillSlugs: formData.skillSlugs,
			traitSlugs: formData.traitSlugs,
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/races/${race.slug}`),
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
		await revalidateTagByClientSide("/races");
		await revalidatePathByClientSide("/racas");
	}

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/racas",
			name: "Raças",
			icon: getAlbinaApiFullAddress(`/favicon/races`),
		},
		{
			href: `/racas/${race.slug}`,
			name: race.name,
			icon: race.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${race.name}]`,
			icon: race.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title="EDIT"
			isEditable={true}
			banner={race.bannerUrl}
			icon={race.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(`/favicon/races/${race.slug}`)}
			bannerChangeRoute={getAlbinaApiFullAddress(`/banner/races/${race.slug}`)}
			metadataTag={`race-${race.slug}`}
			cacheTags={["/races"]}
			cachePaths={["/racas"]}>
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
				<HookedForm.TextArrayInput<FormInput>
					fieldName="introduction"
					useTextArea
				/>
				<HookedForm.TextArrayInput<FormInput>
					fieldName="personality"
					useTextArea
				/>
				<HookedForm.TextArrayInput<FormInput>
					fieldName="culture"
					useTextArea
				/>
				<HookedForm.TextArrayInput<FormInput>
					fieldName="miscellaneous"
					useTextArea
				/>
				<HookedForm.TextArrayInput<FormInput>
					fieldName="groups"
					useTextArea
				/>
				<HookedForm.TextArrayInput<FormInput>
					fieldName="relations"
					useTextArea
				/>
				<HookedForm.TextArrayInput<FormInput>
					fieldName="description"
					useTextArea
				/>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.NumberInput<FormInput>
							fieldName="vitality"
							min={1}
							max={4}
						/>
					}
					colum2={
						<HookedForm.NumberInput<FormInput>
							fieldName="vigor"
							min={1}
							max={4}
						/>
					}
					colum3={
						<HookedForm.NumberInput<FormInput>
							fieldName="manapool"
							min={1}
							max={4}
						/>
					}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.NumberInput<FormInput>
							fieldName="physicalPower"
							min={1}
							max={4}
						/>
					}
					colum2={
						<HookedForm.NumberInput<FormInput>
							fieldName="magicalPower"
							min={1}
							max={4}
						/>
					}
				/>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={<HookedForm.TextInput<FormInput> fieldName="height" />}
					colum2={<HookedForm.TextInput<FormInput> fieldName="weight" />}
					colum3={<HookedForm.TextInput<FormInput> fieldName="speed" />}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={<HookedForm.TextInput<FormInput> fieldName="longevity" />}
					colum2={
						<HookedForm.Select<FormInput>
							fieldName="language"
							options={enumToSelectStringOptions(LanguageType)}
						/>
					}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					colum1={
						<HookedForm.TextArrayInput<FormInput>
							fieldName="traitSlugs"
							width={"99%"}
						/>
					}
					colum2={
						<HookedForm.TextArrayInput<FormInput>
							fieldName="skillSlugs"
							width={"99%"}
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
				safetyText={race.name}
				deletionRoute={getAlbinaApiFullAddress(`/races/${race.slug}`)}
				routerPushRoute="/racas"
				revalidateTag="/races"
			/>

			<UIBasics.Divisor />
			<DynamicGallery
				url={getAlbinaApiFullAddress(`/images/races/${race.slug}`)}
			/>
			<UIBasics.Divisor />
		</GenericPageContainer>
	);
}
