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

const mechanicalAbilityZObject = z.object({
	id: zGuid(),
	name: z.string(),
	definition: z.string(),
	category: zEnumKey(MechanicalAbilityCategory),
	trigger: zEnumKey(MechanicalAbilityTrigger),
});

const schema = z.object({
	slug: zSlug(),
	name: z.string().min(1, "Min 1 lenght"),
	type: zEnumKey(CreatureType),
	subType: zEnumKey(CreatureSubType),

	magicAttributes: zEnumKeyArray(MagicAttribute),
	lifeState: zEnumKey(LifeState),
	ethicAlignment: zEnumKey(EthicAlignment),
	moralAlignment: zEnumKey(MoralAlignment),
	level: z.number().min(-1, "Min -1").max(35, "Max of 35"),
	experience: z.number().min(-1, "Min -1"),
	isHidden: z.boolean(),

	strength: z.number().min(-1, "Min of -1.").max(99, "Max of 99"),
	agility: z.number().min(-1, "Min of -1.").max(99, "Max of 99"),
	technique: z.number().min(-1, "Min of -1.").max(99, "Max of 99"),
	constitution: z.number().min(-1, "Min of -1.").max(99, "Max of 99"),
	intelligence: z.number().min(-1, "Min of -1.").max(99, "Max of 99"),
	wisdom: z.number().min(-1, "Min of -1.").max(99, "Max of 99"),
	charisma: z.number().min(-1, "Min of -1.").max(99, "Max of 99"),

	speedWalk: z.number().min(0, "Min of 0"),
	speedCombat: z.number().min(0, "Min of 0"),
	speedSwim: z.number().min(-1, "Min of -1"),
	speedFly: z.number().min(-1, "Min of -1"),
	speedClimb: z.number().min(-1, "Min of -1"),
	speedBurrow: z.number().min(-1, "Min of -1"),
	healthPoints: z.number().min(-1, "Min of -1"),
	armorClass: z.number().min(0, "Min of 0"),
	initiative: z.number().min(-99, "Min of -99").max(99, "Max of +99"),

	length: z.number().min(0, "Min of 0 cm").max(100000, "Max of 100000 cm"),
	width: z.number().min(0, "Min of 0 cm").max(100000, "Max of 100000 cm"),
	height: z.number().min(0, "Min of 0 cm").max(100000, "Max of 100000 cm"),
	languages: zEnumKeyArray(LanguageType),
	vulnerabilities: z.array(z.string()),
	resistances: z.array(z.string()),
	immunities: z.array(z.string()),
	testBonuses: z.array(
		z.object({
			key: z.string(),
			value: z.number().min(-20, "Min of -20").max(20, "Max of +20"),
		}),
	),
	senses: z.array(
		z.object({
			key: z.string(),
			value: z.string(),
		}),
	),

	mechanicalAbilitiesPassive: z.array(mechanicalAbilityZObject),
	mechanicalAbilitiesActive: z.array(mechanicalAbilityZObject),

	source: z.string(),

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
	["Passive"],
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
			source: formData.source,
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
					walk: formData.speedWalk,
					combat: formData.speedCombat,
					swim: formData.speedSwim > -1 ? formData.speedSwim : undefined,
					fly: formData.speedFly > -1 ? formData.speedFly : undefined,
					climb: formData.speedClimb > -1 ? formData.speedClimb : undefined,
					burrow: formData.speedBurrow > -1 ? formData.speedBurrow : undefined,
				},
			},
			miscMetrics: {
				vulnerabilities: formData.vulnerabilities,
				resistances: formData.resistances,
				immunities: formData.immunities,
				languages: formData.languages,
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
			mechanicalAbilities: [
				...formData.mechanicalAbilitiesPassive,
				...formData.mechanicalAbilitiesActive,
			]
				.sort((a, b) => {
					const aPassive = a.trigger === "Passive";
					const bPassive = b.trigger === "Passive";
					if (aPassive !== bPassive) return aPassive ? -1 : 1;
					return (
						MechanicalAbilityCategory[a.category] -
						MechanicalAbilityCategory[b.category]
					);
				})
				.map((x, index) => ({
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
		form.reset(creatureDataToFormData(await response.json()));
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

				<HookedForm.BooleanInput<FormInput>
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
							<HookedForm.NumberInput<FormData>
								fieldName="level"
								min={-1}
								max={35}
							/>
							<HookedForm.NumberInput<FormData>
								fieldName="experience"
								min={-1}
							/>
						</UIBasics.Box>
					}
					colum2={
						<UIBasics.Box
							backgroundColor="darkGray"
							withoutPadding
							withoutMargin>
							<HookedForm.NumberInput<FormData>
								fieldName="healthPoints"
								min={-1}
							/>
							<HookedForm.NumberInput<FormData>
								fieldName="armorClass"
								min={0}
							/>
							<HookedForm.NumberInput<FormData>
								fieldName="initiative"
								min={-99}
								max={99}
							/>
						</UIBasics.Box>
					}
					colum3={
						<UIBasics.Box
							backgroundColor="gray"
							withoutPadding
							withoutMargin>
							<HookedForm.NumberInput<FormData>
								fieldName="width"
								min={0}
								max={100000}
							/>
							<HookedForm.NumberInput<FormData>
								fieldName="height"
								min={0}
								max={100000}
							/>
							<HookedForm.NumberInput<FormData>
								fieldName="length"
								min={0}
								max={100000}
							/>
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
								<HookedForm.NumberInput<FormData>
									fieldName="speedWalk"
									min={0}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="speedCombat"
									min={0}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="speedSwim"
									min={-1}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="speedFly"
									min={-1}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="speedClimb"
									min={-1}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="speedBurrow"
									min={-1}
								/>

								<HookedForm.TextArrayInput<FormData> fieldName="vulnerabilities" />
								<HookedForm.TextArrayInput<FormData> fieldName="resistances" />
							</UIBasics.Box>
						}
						colum2={
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									flex: 1,
								}}>
								<HookedForm.TextInput<FormData> fieldName="source" />
								<HookedForm.Select<FormData>
									fieldName="ethicAlignment"
									options={ethicAlignmentOptions}
								/>
								<HookedForm.Select<FormData>
									fieldName="moralAlignment"
									options={moralAlignmentOptions}
								/>
								<HookedForm.MultiSelect<FormData>
									fieldName="languages"
									options={languageOptions}
								/>
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
									min={-1}
									max={99}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="agility"
									color="blue"
									min={-1}
									max={99}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="technique"
									color="gray"
									min={-1}
									max={99}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="constitution"
									color="green"
									min={-1}
									max={99}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="intelligence"
									color="yellow"
									min={-1}
									max={99}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="wisdom"
									color="purple"
									min={-1}
									max={99}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName="charisma"
									color="pink"
									min={-1}
									max={99}
								/>
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
												divisionRatio={2}
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
														min={-20}
														max={20}
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
												divisionRatio={-1}
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
								<MechanicalAbilityArrayForm fieldName="mechanicalAbilitiesPassive" />
							</div>
						}
						colum2={
							<div
								style={{ display: "flex", flexDirection: "column", flex: 1 }}>
								<MechanicalAbilityArrayForm fieldName="mechanicalAbilitiesActive" />
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

		source: creature.source,

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

		speedWalk: creature.coreMetrics.speedStats.walk,
		speedCombat: creature.coreMetrics.speedStats.combat,
		speedSwim: creature.coreMetrics.speedStats.swim ?? -1,
		speedFly: creature.coreMetrics.speedStats.fly ?? -1,
		speedClimb: creature.coreMetrics.speedStats.climb ?? -1,
		speedBurrow: creature.coreMetrics.speedStats.burrow ?? -1,
		healthPoints: creature.coreMetrics.healthPoints,
		armorClass: creature.coreMetrics.armorClass,
		initiative: creature.coreMetrics.initiative,

		length: creature.miscMetrics.volume.length,
		width: creature.miscMetrics.volume.width,
		height: creature.miscMetrics.volume.height,
		languages: creature.miscMetrics.languages,
		vulnerabilities: creature.miscMetrics.vulnerabilities,
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

		mechanicalAbilitiesPassive: creature.mechanicalAbilities
			.filter((x) => x.trigger == "Passive")
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
			.map((x) => ({
				...x,
				order: undefined,
			})),
		mechanicalAbilitiesActive: creature.mechanicalAbilities
			.filter((x) => x.trigger != "Passive")
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
			.map((x) => ({
				...x,
				order: undefined,
			})),

		summary: creature.info.summary,
		description: creature.info.description,
		miscellaneous: creature.info.miscellaneous,
	};
}

function MechanicalAbilityArrayForm({
	fieldName,
}: {
	fieldName: "mechanicalAbilitiesPassive" | "mechanicalAbilitiesActive";
}) {
	return (
		<HookedForm.ObjectArrayInput<FormData>
			fieldName={fieldName}
			isReorderable
			defaultObject={{
				id: Guid.Empty,
				name: "",
				definition: "",
				category: MechanicalAbilityCategory[MechanicalAbilityCategory.Common],
				trigger:
					fieldName == "mechanicalAbilitiesPassive"
						? MechanicalAbilityTrigger[MechanicalAbilityTrigger.Passive]
						: MechanicalAbilityTrigger[MechanicalAbilityTrigger.Action],
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
									fieldName={fieldName}
									objectKey="name"
									index={index}
									ref={lastRef}
								/>
							}
							colum2={
								<HookedForm.ObjectArraySelectInput<FormInput>
									fieldName={fieldName}
									objectKey="category"
									index={index}
									options={mechanicalAbilityCategoryOptions}
								/>
							}
							colum3={
								fieldName != "mechanicalAbilitiesPassive" && (
									<HookedForm.ObjectArraySelectInput<FormInput>
										fieldName={fieldName}
										objectKey="trigger"
										index={index}
										options={mechanicalAbilityTriggerOptions}
									/>
								)
							}
						/>
						<HookedForm.ObjectArrayTextInput<FormInput>
							fieldName={fieldName}
							objectKey="definition"
							index={index}
							ref={lastRef}
							useTextArea
						/>
					</UIBasics.Box>
				);
			}}
		/>
	);
}
