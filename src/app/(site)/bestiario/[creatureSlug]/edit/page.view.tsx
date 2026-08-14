"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import DynamicGallery from "@/components/(SPECIAL)/components/Gallery/DynamicGallery";
import { UIBasics } from "@/components/(UIBasics)";
import { DeletionAlertDialog } from "@/components/(UTILS)/components/DeletionAlertDialog";
import {
	HookedForm,
	zEnumKey,
	zEnumKeyArray,
	zGuid,
	zSlug,
} from "@/libs/stp@forms";
import { Breadcrumb, SetBreadcrumbs, useCurrentUser } from "@/libs/stp@hooks";
import {
	canEditCatalogEntry,
	CreatureData,
	CreatureSubType,
	CreatureType,
	EthicAlignment,
	Guid,
	LanguageType,
	LifeState,
	MagicAttribute,
	MechanicalAbilityCategory,
	MechanicalAbilityTrigger,
	MoralAlignment,
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
import z from "zod";

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(CreatureType),
	subType: zEnumKey(CreatureSubType),

	magicAttributes: zEnumKeyArray(MagicAttribute),
	lifeState: zEnumKey(LifeState),
	ethicAlignment: zEnumKey(EthicAlignment),
	moralAlignment: zEnumKey(MoralAlignment),
	level: z.number(),
	experience: z.number(),
	isHidden: z.boolean(),

	strength: z.number(),
	agility: z.number(),
	technique: z.number(),
	constitution: z.number(),
	intelligence: z.number(),
	wisdom: z.number(),
	charisma: z.number(),

	speedWalk: z.number(),
	speedCombat: z.number(),
	speedSwim: z.number(),
	speedFly: z.number(),
	healthPoints: z.number(),
	armorClass: z.number(),
	initiative: z.number(),

	length: z.number(),
	width: z.number(),
	height: z.number(),
	languages: zEnumKeyArray(LanguageType),
	resistances: z.array(z.string()),
	immunities: z.array(z.string()),
	testBonuses: z.array(
		z.object({
			key: z.string(),
			value: z.number(),
		}),
	),
	senses: z.array(
		z.object({
			key: z.string(),
			value: z.string(),
		}),
	),

	mechanicalAbilities: z.array(
		z.object({
			id: zGuid(),
			name: z.string(),
			definition: z.string(),
			category: zEnumKey(MechanicalAbilityCategory),
			trigger: zEnumKey(MechanicalAbilityTrigger),
		}),
	),

	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

const typeOptions = enumToSelectOptions(CreatureType, [], undefined, false);
const subTypeOptions = enumToSelectOptions(
	CreatureSubType,
	[],
	undefined,
	false,
);
const lifeStateOptions = enumToSelectOptions(LifeState, [], undefined, false);
const magicAttributeOptions = enumToSelectOptions(
	MagicAttribute,
	[],
	undefined,
	false,
);
const ethicAlignmentOptions = enumToSelectOptions(
	EthicAlignment,
	[],
	undefined,
	false,
);
const moralAlignmentOptions = enumToSelectOptions(
	MoralAlignment,
	[],
	undefined,
	false,
);
const languageOptions = enumToSelectOptions(
	LanguageType,
	["Unknown"],
	undefined,
	false,
);
const mechanicalAbilityCategoryOptions = enumToSelectOptions(
	MechanicalAbilityCategory,
	[],
	undefined,
	false,
);
const mechanicalAbilityTriggerOptions = enumToSelectOptions(
	MechanicalAbilityTrigger,
	[],
	undefined,
	false,
);

interface EditPageViewProps {
	creature: CreatureData;
}
export default function EditPageView({ creature }: EditPageViewProps) {
	const { user, loading } = useCurrentUser();
	const [error, setError] = useState<string>("");
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: creatureDataToFormData(creature),
	});

	if (loading || user == null) return null;
	if (!canEditCatalogEntry(RoleHierarchy[user.role]))
		redirect(`/bestiario/${creature.slug}`);

	async function onSubmit(formData: FormData) {
		const body = {
			slug: formData.slug,
			name: formData.name,
			type: formData.type,
			subType: formData.subType,
			abilityScore: {
				strength: formData.strength,
				agility: formData.agility,
				technique: formData.technique,
				constitution: formData.constitution,
				intelligence: formData.intelligence,
				wisdom: formData.wisdom,
				charisma: formData.charisma,
			},
			magicAttributes: formData.magicAttributes,
			alignment: {
				ethic: formData.ethicAlignment,
				moral: formData.moralAlignment,
			},
			coreMetrics: {
				armorClass: formData.armorClass,
				healthPoints: formData.healthPoints,
				initiative: formData.initiative,
				speedStats: {
					walkSpeed: formData.speedWalk,
					combatSpeed: formData.speedCombat,
					swimSpeed: formData.speedSwim,
					flySpeed: formData.speedFly,
				},
			},
			miscMetrics: {
				immunities: formData.immunities,
				languages: formData.languages,
				resistances: formData.resistances,
				senses: Object.fromEntries(
					formData.senses.map(({ key, value }) => [key, value]),
				),
				testBonuses: Object.fromEntries(
					formData.testBonuses.map(({ key, value }) => [key, value]),
				),
				volume: {
					length: formData.length,
					height: formData.height,
					width: formData.width,
				},
			},
			experience: formData.experience,
			level: formData.level,
			lifeState: formData.lifeState,
			mechanicalAbilities: formData.mechanicalAbilities.map((x, index) => ({
				...x,
				order: index,
			})),
			isHidden: formData.isHidden,
			info: {
				summary: formData.summary,
				description: formData.description,
				miscellaneous: formData.miscellaneous,
			},
		};

		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/bestiary/${creature.slug}`),
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
		await revalidateTagByClientSide("/bestiary");
		await revalidatePathByClientSide("/bestiary");
		if (formData.slug != creature.slug)
			redirect(`/bestiario/${formData.slug}/edit`);
		form.reset(await response.json());
	}

	const breadcrumbs: Breadcrumb[] = [
		{
			href: "/bestiario",
			name: "Bestiario",
			icon: getAlbinaApiFullAddress(`/favicon/bestiary`),
		},
		{
			href: `/bestiario/${creature.slug}`,
			name: creature.name,
			icon: creature.iconUrl,
		},
		{
			href: `#`,
			name: `Edit [${creature.name}]`,
			icon: creature.iconUrl,
		},
	];

	return (
		<GenericPageContainer
			title="EDIT"
			isEditable={true}
			banner={creature.bannerUrl}
			icon={creature.iconUrl}
			iconChangeRoute={getAlbinaApiFullAddress(
				`/favicon/bestiary/${creature.slug}`,
			)}
			bannerChangeRoute={getAlbinaApiFullAddress(
				`/banner/bestiary/${creature.slug}`,
			)}
			metadataTag={`bestiary-${creature.slug}`}
			cacheTags={["/bestiary"]}
			cachePaths={["/bestiary"]}
			subTitle2={
				<StyledFalseLink
					withoutIcon
					title={creature.id}
					onClick={async () => {
						await navigator.clipboard.writeText(creature.id);
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

				<HookedForm.BoolInput<FormInput>
					fieldName="isHidden"
					trueBackgroundColor="purple"
					falseBackgroundColor="blue"
				/>

				{/* // Base //////////////////////////////////////////////////////////////////////////////////// */}
				<UIBasics.MultiColumn.Three
					colum1={
						<UIBasics.Box
							backgroundColor="gray"
							withoutPadding
							withoutMargin>
							<HookedForm.Select<FormData>
								fieldName="lifeState"
								options={lifeStateOptions}
							/>
							<HookedForm.NumberInput<FormData> fieldName="level" />
							<HookedForm.NumberInput<FormData> fieldName="experience" />
						</UIBasics.Box>
					}
					colum2={
						<UIBasics.Box
							backgroundColor="darkGray"
							withoutPadding
							withoutMargin>
							<HookedForm.NumberInput<FormData> fieldName="healthPoints" />
							<HookedForm.NumberInput<FormData> fieldName="armorClass" />
							<HookedForm.NumberInput<FormData> fieldName="initiative" />
						</UIBasics.Box>
					}
					colum3={
						<UIBasics.Box
							backgroundColor="gray"
							withoutPadding
							withoutMargin>
							<HookedForm.NumberInput<FormData> fieldName="width" />
							<HookedForm.NumberInput<FormData> fieldName="height" />
							<HookedForm.NumberInput<FormData> fieldName="length" />
						</UIBasics.Box>
					}
				/>
				<UIBasics.Box
					backgroundColor="gray"
					withoutPadding
					withoutMargin>
					<UIBasics.MultiColumn.Three
						colum1={
							<UIBasics.Box
								backgroundColor="darkGray"
								withoutPadding
								withoutMargin>
								<HookedForm.MultiSelect<FormData>
									fieldName="magicAttributes"
									options={magicAttributeOptions}
								/>
								<HookedForm.Select<FormData>
									fieldName="ethicAlignment"
									options={ethicAlignmentOptions}
								/>
								<HookedForm.Select<FormData>
									fieldName="moralAlignment"
									options={moralAlignmentOptions}
								/>
								<HookedForm.NumberInput<FormData> fieldName="speedWalk" />
								<HookedForm.NumberInput<FormData> fieldName="speedCombat" />
								<HookedForm.NumberInput<FormData> fieldName="speedSwim" />
								<HookedForm.NumberInput<FormData> fieldName="speedFly" />
							</UIBasics.Box>
						}
						colum2={
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									flex: 1,
								}}>
								<HookedForm.MultiSelect<FormData>
									fieldName="languages"
									options={languageOptions}
								/>
								<HookedForm.TextArrayInput<FormData> fieldName="resistances" />
								<HookedForm.TextArrayInput<FormData> fieldName="immunities" />
							</div>
						}
						colum3={
							<UIBasics.Box
								backgroundColor="darkGray"
								withoutPadding
								withoutMargin>
								<HookedForm.NumberInput<FormData>
									fieldName="strength"
									color="red"
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="agility"
									color="blue"
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="technique"
									color="gray"
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="constitution"
									color="green"
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="intelligence"
									color="yellow"
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="wisdom"
									color="purple"
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="charisma"
									color="pink"
								/>
							</UIBasics.Box>
						}
					/>
				</UIBasics.Box>

				{/* //////////////////////////////////////////////////////////////////////////////////////////// */}
				<UIBasics.Box
					backgroundColor="darkGray"
					withoutMargin>
					<UIBasics.MultiColumn.Two
						withoutPadding
						colum1={
							<div
								style={{ display: "flex", flexDirection: "column", flex: 1 }}>
								<HookedForm.ObjectArrayInput<FormData>
									fieldName="mechanicalAbilities"
									isReorderable
									defaultObject={{
										id: Guid.Empty,
										name: "",
										definition: "",
										category:
											MechanicalAbilityCategory[MechanicalAbilityCategory.Free],
										trigger:
											MechanicalAbilityTrigger[MechanicalAbilityTrigger.Action],
									}}
									childrenGenerator={({ index, lastRef }) => {
										return (
											<UIBasics.Box
												backgroundColor="gray"
												withoutPadding
												withoutMargin>
												<UIBasics.MultiColumn.Three
													withoutPadding
													colum1={
														<HookedForm.ObjectArrayTextInput<FormInput>
															fieldName="mechanicalAbilities"
															objectKey="name"
															index={index}
															ref={lastRef}
														/>
													}
													colum2={
														<HookedForm.ObjectArraySelectInput<FormInput>
															fieldName="mechanicalAbilities"
															objectKey="category"
															index={index}
															options={mechanicalAbilityCategoryOptions}
														/>
													}
													colum3={
														<HookedForm.ObjectArraySelectInput<FormInput>
															fieldName="mechanicalAbilities"
															objectKey="trigger"
															index={index}
															options={mechanicalAbilityTriggerOptions}
														/>
													}
												/>
												<HookedForm.ObjectArrayTextInput<FormInput>
													fieldName="mechanicalAbilities"
													objectKey="definition"
													index={index}
													ref={lastRef}
													useTextArea
												/>
											</UIBasics.Box>
										);
									}}
								/>
							</div>
						}
						colum2={
							<div
								style={{ display: "flex", flexDirection: "column", flex: 1 }}>
								<HookedForm.ObjectArrayInput<FormData>
									fieldName="testBonuses"
									defaultObject={{
										key: "",
										value: 0,
									}}
									childrenGenerator={({ index, lastRef }) => {
										return (
											<UIBasics.MultiColumn.Two
												withoutPadding
												divisionRatio={-3}
												colum1={
													<HookedForm.ObjectArrayTextInput<FormInput>
														fieldName="testBonuses"
														objectKey="key"
														index={index}
														ref={lastRef}
													/>
												}
												colum2={
													<HookedForm.NumberInput<FormInput>
														fieldName="testBonuses"
														objectIndex={index}
														objectKey="value"
													/>
												}
											/>
										);
									}}
								/>
								<HookedForm.ObjectArrayInput<FormData>
									fieldName="senses"
									defaultObject={{
										key: "",
										value: "",
									}}
									childrenGenerator={({ index, lastRef }) => {
										return (
											<UIBasics.MultiColumn.Two
												divisionRatio={-3}
												colum1={
													<HookedForm.ObjectArrayTextInput<FormInput>
														fieldName="senses"
														objectKey="key"
														index={index}
														ref={lastRef}
													/>
												}
												colum2={
													<HookedForm.ObjectArrayTextInput<FormInput>
														fieldName="senses"
														index={index}
														objectKey="value"
													/>
												}
											/>
										);
									}}
								/>
							</div>
						}
					/>
				</UIBasics.Box>
				{/* //////////////////////////////////////////////////////////////////////////////////////////// */}

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
				safetyText={creature.name}
				deletionRoute={getAlbinaApiFullAddress(`/bestiary/${creature.slug}`)}
				routerPushRoute="/bestiario"
				revalidateTag="/bestiary"
			/>

			<UIBasics.Divisor />
			<DynamicGallery
				url={getAlbinaApiFullAddress(`/gallery/bestiary/${creature.slug}`)}
			/>
			<UIBasics.Divisor />
		</GenericPageContainer>
	);
}

function creatureDataToFormData(creature: CreatureData): FormData {
	return {
		name: creature.name,
		slug: creature.slug,
		type: creature.type,
		subType: creature.subType,

		magicAttributes: creature.magicAttributes,
		lifeState: creature.lifeState,
		ethicAlignment: creature.alignment.ethic,
		moralAlignment: creature.alignment.moral,
		level: creature.level,
		experience: creature.experience,
		isHidden: creature.isHidden,

		strength: creature.abilityScore.strength,
		agility: creature.abilityScore.agility,
		technique: creature.abilityScore.technique,
		constitution: creature.abilityScore.constitution,
		intelligence: creature.abilityScore.intelligence,
		wisdom: creature.abilityScore.wisdom,
		charisma: creature.abilityScore.charisma,

		speedWalk: creature.coreMetrics.speedStats.walkSpeed,
		speedCombat: creature.coreMetrics.speedStats.combatSpeed,
		speedSwim: creature.coreMetrics.speedStats.swimSpeed,
		speedFly: creature.coreMetrics.speedStats.flySpeed,
		healthPoints: creature.coreMetrics.healthPoints,
		armorClass: creature.coreMetrics.armorClass,
		initiative: creature.coreMetrics.initiative,

		length: creature.miscMetrics.volume.length,
		width: creature.miscMetrics.volume.width,
		height: creature.miscMetrics.volume.height,
		languages: creature.miscMetrics.languages,
		resistances: creature.miscMetrics.resistances,
		immunities: creature.miscMetrics.immunities,
		testBonuses: Object.entries(creature.miscMetrics.testBonuses).map(
			(entry) => ({
				key: entry[0],
				value: entry[1],
			}),
		),
		senses: Object.entries(creature.miscMetrics.senses).map((entry) => ({
			key: entry[0],
			value: entry[1],
		})),

		mechanicalAbilities: creature.mechanicalAbilities
			.sort((a, b) => a.order - b.order)
			.map((x) => ({
				...x,
				order: undefined,
			})),

		summary: creature.info.summary,
		description: creature.info.description,
		miscellaneous: creature.info.miscellaneous,
	};
}
