"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import {
	HookedForm,
	SelectOption,
	zEnumKey,
	zJsonStringTyped,
	zSlug,
} from "@/libs/stp@forms";
import { useCurrentUser } from "@/libs/stp@hooks";
import {
	LanguageType,
	RaceData,
	RaceGenerals,
	RaceInfo,
	RaceSubType,
	RaceType,
	RoleHierarchy,
} from "@/libs/stp@types";
import { RaceParameters } from "@/libs/stp@types/dataTypes/race";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { enumToSelectOptions } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { revalidatePathByClientSide } from "@/utils/ServerActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const RaceInfoSchema = z.object({
	introduction: z.array(z.string()),
	personality: z.array(z.string()),
	culture: z.array(z.string()),
	miscellaneous: z.array(z.string()),
	groups: z.array(z.string()),
	relations: z.array(z.string()),
	description: z.array(z.string()),
	images: z.array(z.string()),
});
const RaceParametersSchema = z.object({
	vitality: z.number(),
	vigor: z.number(),
	manapool: z.number(),
	physicalPower: z.number(),
	magicalPower: z.number(),
});
const RaceGeneralsSchema = z.object({
	height: z.string(),
	weight: z.string(),
	longevity: z.string(),
	speed: z.string(),
	language: zEnumKey(LanguageType, []),
});

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(RaceType, ["Unknown"]),
	subType: zEnumKey(RaceSubType, ["Unknown"]),
	info: zJsonStringTyped<RaceInfo>(RaceInfoSchema),
	parameters: zJsonStringTyped<RaceParameters>(RaceParametersSchema),
	generals: zJsonStringTyped<RaceGenerals>(RaceGeneralsSchema),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface EditRacePageContentProps {
	race: RaceData;
}
export function EditRacePageContent({ race }: EditRacePageContentProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, any, FormData>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: race.name,
			slug: race.slug,
			type: RaceType[race.type].toString(),
			subType: RaceSubType[race.subType].toString(),
			info: JSON.stringify(race.info, null, 2),
			parameters: JSON.stringify(race.parameters, null, 2),
			generals: JSON.stringify(race.generals, null, 2),
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			info: formData.info,
			parameters: formData.parameters,
			generals: formData.generals,
		};
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/races/${race.slug}`),
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
		revalidatePathByClientSide(`/racas/${race.slug}`);
	}

	const typeOptions: SelectOption[] = enumToSelectOptions(RaceType, [
		"Unknown",
	]);
	const subTypeOptions: SelectOption[] = enumToSelectOptions(RaceSubType, [
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
			banner={race.bannerUrl}
			icon={race.iconUrl}
			iconChangeRoute={getAlbinaApiAddress(`/favicon/races/${race.slug}`)}
			bannerChangeRoute={getAlbinaApiAddress(`/banner/races/${race.slug}`)}
			metadataTag={`race-${race.slug}`}>
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
					fieldName="parameters"
					label="Parameters"
					height={200}
					style={{ fontFamily: "monospace" }}
				/>
				<HookedForm.TextAreaInput<FormInput>
					fieldName="generals"
					label="Generals"
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
				safetyText={race.name}
				deletionRoute={getAlbinaApiAddress(`/races/${race.slug}`)}
				routerPushRoute="/racas"
			/>

			<UIBasics.Divisor />
		</GenericPageContainer>
	);
}
